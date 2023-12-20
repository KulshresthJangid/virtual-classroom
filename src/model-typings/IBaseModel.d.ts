export interface IBaseModel<T> {
    getTableName(): string;
    insert(data: T): Promise<T>;
    update(id: string, data: Partial<T>): Promise<void>;
    delete(id: string): Promise<void>;
    findById(id: string): Promise<T | null>;
}