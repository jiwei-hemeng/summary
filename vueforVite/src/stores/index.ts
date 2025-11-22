import { createPinia } from "pinia";
import persistPlugin from "./persistPlugin";
const pinia = createPinia();

pinia.use(persistPlugin);
export default pinia;
