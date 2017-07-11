import {Entity, Column, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Collection {

    /**
     * Collection generated id
    */
    @PrimaryGeneratedColumn()
    id:number;

    /**
     * Collection name
    */
    @Column()
    name: string;

    /**
     * Collection description
    */
    @Column()
    description: string;
    
    /**
     * Collections tags for something or other
    */
    @Column()
    tags: string;


    /**
     * serialized weights and id references
    */
    @Column({type:"text"})
    photoContents: string;

    /**
     * Is this collection enabled?
    */
    @Column()
    enabled: boolean;
}