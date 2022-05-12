import { Game } from "./Game";
import { Scene } from "./Scene";

import { Component, ComponentContainer } from "./Component";
import { Entity } from "./Entity";
import { System } from "./System";

export abstract class ECSScene extends Scene {

  // Main state
  private entities = new Map<Entity, ComponentContainer>()
  private systems = new Map<System, Set<Entity>>()

  // Bookkeeping for entities.
  private nextEntityID = 0
  private entitiesToDestroy = new Array<Entity>()

  public abstract customUpdate(game: Game): number;

  /**
   * Default return -1. Any other numbers will tell the game engine to change 
   * the scene to whatever index is returned.
   * @param canvas 
   * @param keyPresses 
   */
  public update(game: Game): number {
    // Update all systems. (Later, we'll add a way to specify the
    // update order.)
    for (let [system, entities] of this.systems.entries()) {
      system.update(game, entities)
    }

    // Remove any entities that were marked for deletion during the
    // update.
    while (this.entitiesToDestroy.length > 0) {
      this.destroyEntity(this.entitiesToDestroy.pop()!);
    }

    return this.customUpdate(game);
  }

  

  // API: Entities

  public addEntity(): Entity {
    let entity = this.nextEntityID;
    this.nextEntityID++;
    this.entities.set(entity, new ComponentContainer());
    return entity;
  }

  /**
   * Marks `entity` for removal. The actual removal happens at the end
   * of the next `update()`. This way we avoid subtle bugs where an
   * Entity is removed mid-`update()`, with some Systems seeing it and
   * others not.
   */
  public removeEntity(entity: Entity): void {
    this.entitiesToDestroy.push(entity);
  }

  public addComponent(entity: Entity, component: Component): void {
    this.entities.get(entity)!.add(component);
    this.checkE(entity);
  }

  public getComponents(entity: Entity): ComponentContainer  {
    return this.entities.get(entity)!;
  }

  public removeComponent(entity: Entity, componentClass: Function): void {
    this.entities.get(entity)?.delete(componentClass);
    this.checkE(entity);
  }

  // API: Systems

  public addSystem(system: System): void {
    // Checking invariant: systems should not have an empty
    // Components list, or they'll run on every entity. Simply remove
    // or special case this check if you do want a System that runs
    // on everything.
    if (system.componentsRequired.size == 0) {
      console.warn('System not added: empty Components list.');
      console.warn(system);
      return;
    }

    // Give system a reference to the ECS so it can actually do
    // anything.
    system.ecs = this;

    // Save system and set who it should track immediately.
    this.systems.set(system, new Set());
    for (let entity of this.entities.keys()) {
      this.checkES(entity, system);
    }
  }

  /**
   * Note: I never actually had a removeSystem() method for the entire
   * time I was programming the game Fallgate (2 years!). I just added
   * one here for a specific testing reason (see the next post).
   * Because it's just for demo purposes, this requires an actual
   * instance of a System to remove (which would be clunky as a real
   * API).
   */
  public removeSystem(system: System): void {
    this.systems.delete(system);
  }

  protected clear(): void {
    this.entities.clear();
    this.systems.clear();
  }

  private destroyEntity(entity: Entity): void {
    this.entities.delete(entity);
    for (let entities of this.systems.values()) {
      entities.delete(entity);  // no-op if doesn't have it
    }
  }

  // @TODO: can I remove this?
  private checkE(entity: Entity): void {
    for (let system of this.systems.keys()) {
      this.checkES(entity, system);
    }
  }

  /**
   * I think this can be removed but I'm going to leave it in for now.
   * @param entity 
   * @param system 
   */
  private checkES(entity: Entity, system: System): void {
    let have = this.entities.get(entity);
    let need = system.componentsRequired;
    if (have!.hasAll(need)) {
      // should be in system
      this.systems.get(system)!.add(entity); // no-op if in
    } else {
      // should not be in system
      this.systems.get(system)!.delete(entity); // no-op if out
    }
  }
};