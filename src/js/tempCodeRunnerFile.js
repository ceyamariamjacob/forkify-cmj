import {getJSON} from './helper.js';
import { RES_PER_PAGE } from './config.js';

//STATE MODULE (recipe,search,bookmarks) && THEIR LOADERS (exported)

export const state={
    recipe:{},
    search:{
        query:'',
        results:[],
        resultsPerPage:RES_PER_PAGE,
        page:1