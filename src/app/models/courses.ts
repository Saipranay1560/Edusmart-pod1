export interface Course {
    id:number;
    title:string;
    description:string;
    status:'Draft'|'Published'|'Archived';
}
