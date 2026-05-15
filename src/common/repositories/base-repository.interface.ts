export interface IBaseRepository<T, CreateDto, UpdateDto> {
  findAll(params: {
    page: number;
    limit: number;
  }): Promise<{ data: T[]; total: number }>;

  findById(id: string): Promise<T | null>;

  create(dto: CreateDto): Promise<T>;

  update(id: string, dto: UpdateDto): Promise<T>;

  delete(id: string): Promise<void>;
}
