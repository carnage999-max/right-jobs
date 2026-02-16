import { create } from 'twrnc';

// We import the configuration to ensure the brand colors are identical
const tw = create(require('../../tailwind.config.js'));

export default tw;
export { tw };
