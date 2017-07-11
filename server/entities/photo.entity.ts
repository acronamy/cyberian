import {Entity, Column, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Photo {
    /**
     * Photo genereated id
    */
    @PrimaryGeneratedColumn()
    id:number;
    /**
     * url reference to file
    */
    @Column()
    url: string;

    /**
     * Hashed internal id reference for photo retrieval
    */
    @Column()
    ref: string;
}