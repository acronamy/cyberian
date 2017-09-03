export function dynamicStyleSheet($) {
    const design = this.design;
    const styleSheet = `
        <style data-theme>
            [data-theme-text='text-color']{
                color:${design.themeTextColor}!important;
            }
            [data-theme='primary-color']{
                background-color:${design.themePrimaryColor}!important;
            }
            [data-theme-text='primary-color']{
                color:${design.themePrimaryColor}!important;
            }
            [data-theme='primary-color-border']{
                background-color:${design.themePrimaryColor}!important;
                border-color:${design.themePrimaryColor}!important;
            }
            [data-theme='general-color']{
                background-color:${design.themeGeneralColor}!important;
            }
        </style>
    `
    .trim().replace(/[\n|\t]/g, "");

    $("head").append(styleSheet);
} 
