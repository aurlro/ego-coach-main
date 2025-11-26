import { describe, it, expect, beforeEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import { Window } from 'happy-dom';

describe('UI Layout Regression Tests', () => {
    let window;
    let document;

    beforeEach(() => {
        const htmlPath = path.resolve(__dirname, '../../index.html');
        const html = fs.readFileSync(htmlPath, 'utf8');

        window = new Window();
        document = window.document;
        document.write(html);
    });

    it('Header should have correct layout classes', () => {
        const header = document.querySelector('header');
        expect(header).not.toBeNull();

        // Check for Flexbox and Justify Between
        expect(header.classList.contains('flex')).toBe(true);
        expect(header.classList.contains('justify-between')).toBe(true);
        expect(header.classList.contains('items-center')).toBe(true);
        expect(header.classList.contains('w-full')).toBe(true);
    });

    it('Theme toggle should be in the header', () => {
        const header = document.querySelector('header');
        const themeToggle = header.querySelector('#theme-toggle');
        expect(themeToggle).not.toBeNull();
    });

    it('Sidebar should have correct mobile classes', () => {
        const sidebar = document.querySelector('#sidebar');
        // Should be fixed and hidden by default on mobile (via translate)
        expect(sidebar.classList.contains('fixed')).toBe(true);
        expect(sidebar.classList.contains('-translate-x-full')).toBe(true);
        expect(sidebar.classList.contains('lg:translate-x-0')).toBe(true);
    });
});
