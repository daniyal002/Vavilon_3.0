export interface Setting {
    key: string; // Или используйте конкретный тип, если он определен, например, SettingKey
    value: boolean;
  }
  
  export interface UpdateSettingInput {
    id?:number,
    key: string;
    value: boolean;
  }