import {Entity, Column, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    username: string;
    
    @Column()
    first_name: string;
    
    @Column()
    last_name: string;
    
    @Column()
    avatar:string;
    
    @Column()
    password:string;
    
    @Column()
    bio:string;
    
    @Column()
    forHire:string;
    
    @Column()
    email:string;
}