import { m } from "framer-motion"
import type { Config } from "tailwindcss"

const config = {
    darkMode: ["class"],
    content: [
        './pages/**/*.{ts,tsx}',
        './components/**/*.{ts,tsx}',
        './app/**/*.{ts,tsx}',
        './src/**/*.{ts,tsx}',
    ],
    prefix: "",
    theme: {
        container: {
            center: true,
            padding: "2rem",
            screens: {
            "2xl": "1400px",
            },
      },
      extend: {
        colors: {
            theme : {
                bgPrimary : "rgba(1,1,1,255)",
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
            primary: {
                DEFAULT: "hsl(var(--primary))",
                foreground: "hsl(var(--primary-foreground))",
            },
            secondary: {
                DEFAULT: "hsl(var(--secondary))",
                foreground: "hsl(var(--secondary-foreground))",
            },
            destructive: {
                DEFAULT: "hsl(var(--destructive))",
                foreground: "hsl(var(--destructive-foreground))",
            },
            muted: {
                DEFAULT: "hsl(var(--muted))",
                foreground: "hsl(var(--muted-foreground))",
            },
            accent: {
                DEFAULT: "hsl(var(--accent))",
                foreground: "hsl(var(--accent-foreground))",
            },
            popover: {
                DEFAULT: "hsl(var(--popover))",
                foreground: "hsl(var(--popover-foreground))",
            },
            card: {
                DEFAULT: "hsl(var(--card))",
                foreground: "hsl(var(--card-foreground))",
            },
        },
        fontSize : {
            "xxs" : "0.7rem"
        },
        borderRadius: {
            lg: "var(--radius)",
            md: "calc(var(--radius) - 2px)",
            sm: "calc(var(--radius) - 4px)",
        },
        keyframes: {
            "accordion-down": {
                from: { height: "0" },
                to: { height: "var(--radix-accordion-content-height)" },
            },
            "accordion-up": {
                from: { height: "var(--radix-accordion-content-height)" },
                to: { height: "0" },
            },
        },
        animation: {
            "accordion-down": "accordion-down 0.2s ease-out",
            "accordion-up": "accordion-up 0.2s ease-out",
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
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config