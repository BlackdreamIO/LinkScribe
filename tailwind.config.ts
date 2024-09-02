import type { Config } from "tailwindcss";
const svgToDataUri = require("mini-svg-data-uri");
 
const colors = require("tailwindcss/colors");
const {
  default: flattenColorPalette,
} = require("tailwindcss/lib/util/flattenColorPalette");

const config = {
    content: [
        './pages/**/*.{ts,tsx}',
        './components/**/*.{ts,tsx}',
        './app/**/*.{ts,tsx}',
        './src/**/*.{ts,tsx}',
    ],
    prefix: "",
    theme: {
      extend: {
        colors: {
            theme : {
                bgPrimary : "#101010",
                bgSecondary : "#09090A",
                bgThird : "rgba(38,38,38,255)",
                bgFourth : "rgba(10,10,10,255)",
                bgFifth : "rgba(15,15,15,255)",

                textPrimary : "rgb(255,255,255,255)",
                textSecondary : "#C8BCF6",
                textThird : "rgb(150,150,150,255)",
                textLink : "#90c1f8",

                primaryAccent : "#C8BCF6",

                borderSecondary : "#C8BCF6",
                borderNavigation : "#38bdf8",
                borderKeyboardParentNavigation : "#d3fc03",
            },
            border: "hsl(var(--border))",
            input: "hsl(var(--input))",
            ring: "hsl(var(--ring))",
            background: "hsl(var(--background))",
            foreground: "hsl(var(--foreground))",
        },
        maxWidth : {
            'tiny' : '480px',
            'sm'  : '640px',
            'md'  : '768px',
            'lg'  : '1024px',
            'xl'  : '1280px',
            '2xl' :  '1536px',
            '3xl' :  '1920px',
        },
        screens: {
    		'tiny': {'min': '480px', 'max': '639px'}, // => @media (min-width: 480px and max-width: 639px) { ... }
    		'sm': {'min': '640px', 'max': '767px'}, // => @media (min-width: 640px and max-width: 767px) { ... }
    		'md': {'min': '768px', 'max': '1023px'}, // => @media (min-width: 768px and max-width: 1023px) { ... }
    		'lg': {'min': '1024px', 'max': '1279px'}, // => @media (min-width: 1024px and max-width: 1279px) { ... }
    		'xl': {'min': '1280px', 'max': '1535px'}, // => @media (min-width: 1280px and max-width: 1535px) { ... }
    		'2xl': {'min': '1536px', 'max': '1919px' }, // => @media (min-width: 1536px and max-width: 1919px) { ... }
    		'3xl': {'min': '1920px'}, // => @media (min-width: 1920px) { ... }
            'max-tiny' : {max : '480px'},
            'max-sm' : {max : '640px'},
            'max-md' : {max : '768px'},
            'max-lg' : {max : '1024px'},
            'max-xl' : {max : '1280px'},
            'max-2xl' : {max : '1536px'},
            'max-3xl' : {max : '1920px'},
    	},
        maxHeight : {
            'auto' : 'auto'
        },
      },
    },
  plugins: [require("tailwindcss-animate"),
    addVariablesForColors,
    function ({ matchUtilities, theme }: any) {
      matchUtilities(
        {
          "bg-grid": (value: any) => ({
            backgroundImage: `url("${svgToDataUri(
              `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="${value}"><path d="M0 .5H31.5V32"/></svg>`
            )}")`,
          }),
          "bg-grid-small": (value: any) => ({
            backgroundImage: `url("${svgToDataUri(
              `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="8" height="8" fill="none" stroke="${value}"><path d="M0 .5H31.5V32"/></svg>`
            )}")`,
          }),
          "bg-dot": (value: any) => ({
            backgroundImage: `url("${svgToDataUri(
              `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="16" height="16" fill="none"><circle fill="${value}" id="pattern-circle" cx="10" cy="10" r="1.6257413380501518"></circle></svg>`
            )}")`,
          }),
        },
        { values: flattenColorPalette(theme("backgroundColor")), type: "color" }
      );
    },
  ],
} satisfies Config;

function addVariablesForColors({ addBase, theme }: any) {
  let allColors = flattenColorPalette(theme("colors"));
  let newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
  );
 
  addBase({
    ":root": newVars,
  });
}

export default config