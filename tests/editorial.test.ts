import test from "node:test";import assert from "node:assert/strict";import {formatIngredient,parseIngredient} from "../lib/ingredient";import {recipeInputSchema} from "../lib/recipe-schema";
test("quantités structurées",()=>{const item=parseIngredient("200 g de tofu ferme");assert.deepEqual(item,{label:"200 g de tofu ferme",quantity:200,unit:"g",name:"tofu ferme"});assert.equal(formatIngredient(item,1.5),"300 g tofu ferme")});
test("recette incomplète refusée",()=>assert.equal(recipeInputSchema.safeParse({title:"X"}).success,false));
