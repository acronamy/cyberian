import {Entity, Column, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Design {
    /**
     * id
    */
    @PrimaryGeneratedColumn()
    id:number;
    
    //THEME
    
    /**
     * The brand color, often used in headings, logos and selections.
    */
    @Column({default:"#000000"})
    themePrimaryColor: string;

    /**
     * The general colour used for this websites background.
    */
    @Column({default:"#ffffff"})
    themeGeneralColor: string;

    /**
     * The text color will be set to either black or white based on the theme colour.
    */
    @Column({default:"#000000"})
    themeTextColor: string;

    //Carousel
    
    /**
     * Which collections should be included in the carousel?
    */
    @Column({default:"{}"})
    carouselIncludes: string;

    /**
     * What speed should the carousel scroll if autoscroll is on
    */
    @Column({default:8})
    carouselSpeed: number;

    /**
     * Should the carousel autoscroll?
    */
    @Column({default:false})
    carouselAutoScroll: number;

    //ABOUT ME
    
    /**
     * In the about me secion of the front website, what is the heading?
    */
    @Column({default:"About me"})
    aboutMeHeading: string;

    /**
     * In the about me section of the front website what is the bio content?
    */
    @Column({default:""})
    aboutMeTextBio: string;

    /**
     * In the about me section of the front website, where should the text box sit?
    */
    @Column({default:"right"})
    aboutMeTextAlignment: string;

    /**
     * In the about me section of the front website, what is the background image?
    */
    @Column({default:"/images/no-image.jpeg"})
    aboutMeBackgroundImage: string;

    /**
     * In the about me section of the front website, what is the background image alignment?
    */
    @Column({default:"right"})
    aboutMeBackgroundImageAlignment: string;

    //PHOTO GALLERY

    /**
     * which collections to include in photo galleries and menus?
    */
    @Column({default:"{}"})
    photoGaleryncludes: string;

    /**
     * In the contact me section of the front website, what is the background image?
    */
    @Column({default:"/images/no-image.jpeg"})
    contactMeBackgroundImage: string;

    /**
     * In the contact me section of the front website, what is the background image alignment?
    */
    @Column({default:"right"})
    contactMeBackgroundImageAlignment: string;



}