export type BuilderPartType = 'CASE' | 'PCB' | 'SWITCH' | 'KEYCAPS';

export interface IBuilderPart {
  id: string;
  type: BuilderPartType;
  name: string;
  brand: string;
  price: number;
  image: string;
  specs: Record<string, unknown>;
  inStock: boolean;
  createdAt: Date;
  updatedAt: Date;
}
