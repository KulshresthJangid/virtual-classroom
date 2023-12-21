export interface IBaseModel<T> {
    getTableName(): string;
    insert(data: T): Promise<T>;
    update(id: number, data: Partial<T>): Promise<void>;
    delete(id: number): Promise<void>;
    findById(id: number): Promise<T | null>;
}