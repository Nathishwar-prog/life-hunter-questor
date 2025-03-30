
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// Solo Leveling inspired colors
				hunter: {
					primary: '#2D3250',
					secondary: '#424769',
					accent: '#7077A1',
					highlight: '#8D8FAD',
					blue: '#6272D9',
					purple: '#9256E5',
					danger: '#FF4561',
					success: '#36DE7E',
				},
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' },
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' },
				},
				'pulse-glow': {
					'0%, 100%': {
						opacity: '1',
						boxShadow: '0 0 10px rgba(146, 86, 229, 0.7)'
					},
					'50%': {
						opacity: '0.7',
						boxShadow: '0 0 20px rgba(146, 86, 229, 0.9)'
					},
				},
				'float': {
					'0%, 100%': {
						transform: 'translateY(0)',
					},
					'50%': {
						transform: 'translateY(-10px)',
					},
				},
				'stat-increase': {
					'0%': {
						transform: 'scale(1)',
						color: 'white',
					},
					'50%': {
						transform: 'scale(1.2)',
						color: '#36DE7E',
					},
					'100%': {
						transform: 'scale(1)',
						color: 'white',
					},
				},
				'stat-decrease': {
					'0%': {
						transform: 'scale(1)',
						color: 'white',
					},
					'50%': {
						transform: 'scale(1.2)',
						color: '#FF4561',
					},
					'100%': {
						transform: 'scale(1)',
						color: 'white',
					},
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'pulse-glow': 'pulse-glow 2s infinite',
				'float': 'float 3s ease-in-out infinite',
				'stat-increase': 'stat-increase 1s forwards',
				'stat-decrease': 'stat-decrease 1s forwards',
			},
			backgroundImage: {
				'hunter-gradient': 'linear-gradient(135deg, #2D3250 0%, #424769 100%)',
				'quest-gradient': 'linear-gradient(135deg, rgba(45, 50, 80, 0.9) 0%, rgba(66, 71, 105, 0.9) 100%)',
				'card-highlight': 'linear-gradient(135deg, rgba(98, 114, 217, 0.1) 0%, rgba(146, 86, 229, 0.1) 100%)',
			},
		},
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
