const world = 'world';

export function hello(who: string = world): string {
    console.log('HERE');
    return `Hello ${who}! `;
}

hello(world);
