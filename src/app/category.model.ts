export interface Category {
    id: string; // Use of strings for unique ID's
    name: string;
    description?: string; // Optional description field
    createdAt: Date; // Timestamp for when it was added
    updatedAt: Date; // Timestamp for last update
}