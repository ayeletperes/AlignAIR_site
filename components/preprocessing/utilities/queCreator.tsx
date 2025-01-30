export class Queue<T> {
    private items: T[] = [];
    private maxSize: number;
  
    constructor(maxSize = Infinity) {
      this.maxSize = maxSize;
    }
  
    put(item: T): void {
      if (this.items.length >= this.maxSize) {
        throw new Error('Queue is full');
      }
      this.items.push(item);
    }
  
    get(): T | undefined {
      return this.items.shift();
    }
  
    size(): number {
      return this.items.length;
    }
  
    isEmpty(): boolean {
      return this.items.length === 0;
    }
  }
  