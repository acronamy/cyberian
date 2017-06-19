import {Entity, Column, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Site {
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    name: string;

    @Column()
    email: string;

    @Column({type:"text"})
    cover: string;
}