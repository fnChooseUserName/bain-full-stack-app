/// <reference types="@sveltejs/kit" />

// Declare alias module
declare module '$lib/*' {
    const content: any;
    export default content;
}

declare module '*.svelte' {
    const content: any;
    export default content;
}
