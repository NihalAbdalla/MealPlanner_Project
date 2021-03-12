var searchButton = document.querySelector(".input-group-btn")
searchButton.addEventListener("click", search)

// Define three global variables to hold total calories, fat and carbs for selected recipe
var totCals = 0
var totFat = 0
var totCarbs = 0
var totProtein = 0

var recipeName = ""
var ingredients = []
var measure = []
var instructions = ""

function search(event){
  event.preventDefault()
  var recipeContainer = document.getElementById("recipe-generator-display")
  recipeContainer.innerHTML = ""

  var searchIngredient = document.getElementById("recipeInput").value

  fetch("https://www.themealdb.com/api/json/v1/1/filter.php?i=" + searchIngredient).then(function(response) {
    // The browser fetches the resource from the remote server without first looking in the cache.
    // The browser will then update the cache with the downloaded resource.
      if (response.ok) {
          return response.json().then(function(data) {
            console.log(data)
            if (data.meals){
              displayRecipes(data.meals)
            }
            else {
              noResults()
            }
          }) 
      }
          else{
              throw Error(response.statusText);
          }
  })
}

function noResults() { 
  var recipeContainer = document.getElementById("recipe-generator-display")
  var errMessage = "Sorry, no results for this ingredient! Try another ingredient."
  var errMessageEl = document.createElement("h1")
  errMessageEl.setAttribute("class", "error-message")
  errMessageEl.textContent = errMessage
  recipeContainer.appendChild(errMessageEl)

}



function displayRecipes(meals) {
 for (i=0; i<meals.length; i++){
    var recipeContainer = document.getElementById("recipe-generator-display")
    var currentRecipe = document.createElement("div")
    
    currentRecipe.textContent = meals[i].strMeal
    currentRecipe.setAttribute("onclick","getIngredients(this.textContent)")
    currentRecipe.setAttribute("class", "recipe-button")
    recipeContainer.appendChild(currentRecipe)

    let thumbEl = document.createElement("div")
    thumbEl.setAttribute("class", "image-div")
    let thumbURL = meals[i].strMealThumb
    console.log(thumbURL)
    thumbEl.innerHTML = "<img class = 'recipe-image' src='" + thumbURL  + "'>"
    recipeContainer.appendChild(thumbEl)
 } 
}

function getIngredients(recipe) {

  recipeName = recipe

    for(i=0; i<recipe.length; i++){
         recipe = recipe.replace(" ","_")
    }

    fetch("https://www.themealdb.com/api/json/v1/1/search.php?s=" + recipe).then(function(response){
        // The browser fetches the resource from the remote server without first looking in the cache.
        // The browser will then update the cache with the downloaded resource.
          if (response.ok) {
              return response.json().then(function(data) {
                  console.log(data)
                  edamamPass(data.meals, recipeName)
              }) 
          }
              else{
                  throw Error(response.statusText)
              }
      })
}


function edamamPass(data) {

  var obj = data[0]
  for (const key in obj) {
      if (key.includes('strIngredient') && obj[key]) {
        ingredients.push(obj[key])
      }
    }


  for (const key in obj) {
      if (key.includes('strMeasure') && obj[key]) {
        measure.push(obj[key].trim())
      }
    }

  var recipeArray = []

  for (i=0; i<measure.length; i++) {
    recipeArray[i] = measure[i] + " " + ingredients[i]
  }
  
    var recipeObject = {
    title: recipeName,
    ingr: recipeArray,
    yield: 6
  }
  
  fetch('https://api.edamam.com/api/nutrition-details?app_id=749d2c5d&app_key=6212ed22f3bc63c9398aabf63bd48cc2', {
      method: 'POST',
      body: JSON.stringify(recipeObject),
      headers: {
        "Content-Type": "application/json"
      }
    }).then(function(response){
      if (response.ok) {
        return response.json().then(function(data) {
          sumNutrients(data)
        })
      }
      else {
        lowQuality()
      }
    })

  function lowQuality() {
    var recipeContainer = document.getElementById("recipe-generator-display")
    recipeContainer.innerHTML = ""

    var errEl = document.createElement("h1")
    errEl.setAttribute("class", "error-message")
    var errMessage = "Sorry, this recipe's nutrition facts cannot be obtained, please try again."
    errEl.textContent = errMessage
    recipeContainer.appendChild(errEl)
  }




  // .then(response => response.json())
  // .then(json => {
  //     sumNutrients(json)
  // });
  

  
  // ***Measurements-to-gram converter goes here***
  // for (i=0; i<measure.length; i++) {

  // }

    for (const key in obj){
      if (key.includes('strInstructions') && obj[key]) {
        instructions = obj[key]
      }
    }
}


function sumNutrients (data) {
  totCarbs = Math.round(totCarbs + data.totalNutrients.CHOCDF.quantity)
  totFat = Math.round(totFat + data.totalNutrients.FAT.quantity)
  totProtein = Math.round(totProtein + data.totalNutrients.PROCNT.quantity)
  totCals = Math.round(totCals + data.totalNutrients.ENERC_KCAL.quantity)

  console.log(data)
  
  displayComponents()
}

// function fetchNutrition (ingredients) {
//   for (var i=0; i<ingredients.length; i++) {
//     var ingredient = ingredients[i]
//     var ingredientForm = ingredient.replace(" ", "%20")
    
//     // ***Ask TA why we had to use addNutrients function below***
//     fetch("https://api.edamam.com/api/food-database/v2/parser?ingr=" + ingredientForm + "&app_id=15deb37b&app_key=ec341a9362cca4de065a6bd100736317").then(function(response) {
//         if (response.ok) {
//             return response.json().then(function(data) {
//                 console.log(data)
//                 addNutrients(data)
//             })
//         }
//         else {
//             throw Error(response.statusText);
//         }
//     })

//   }

// }

// function addNutrients(data) {
//   console.log(data.hints[0].food.nutrients.CHOCDF)
  
//   // for (i=0; i<measure.length; i++) {
//   //   var thisMeasure = measure[i]
//   //   if (thisMeasure.charAt(thisMeasure.length - 1) !== 'g') {
//   //     va=  
//   //   }

//   // }

//   console.log(measure)

//   totCarbs = totCarbs + data.hints[0].food.nutrients.CHOCDF
//   totFat = totFat + data.hints[0].food.nutrients.FAT
//   totCals = totCals + data.hints[0].food.nutrients.ENERC_KCAL
//   totProtein = totProtein + data.hints[0].food.nutrients.PROCNT

//   displayComponents()

//   console.log(totCarbs)
//   console.log(totFat)
//   console.log(totProtein)
//   console.log(totCals)
// }

function displayComponents() {
  var recipeContainer = document.getElementById("recipe-generator-display")
  recipeContainer.innerHTML = ""

  var cardName = document.createElement("h2")
  cardName.textContent = recipeName
  recipeContainer.appendChild(cardName)

  var cardIngredients = document.createElement("ul")
  cardIngredients.setAttribute("id", "recipe-list")
  recipeContainer.appendChild(cardIngredients)
  
  for (var i=0; i<ingredients.length; i++) {
    var listItem = document.createElement("li")
    listItem.textContent = ingredients[i] + " " + "|" + " " + measure[i]
    cardIngredients.appendChild(listItem)    
  }

  var instrEl = document.createElement("p")
  instrEl.setAttribute("id", "recipe-instructions")
  instrEl.textContent = instructions
  recipeContainer.appendChild(instrEl)

  var servingsEl = document.createElement("h5")
  servingsEl.textContent = "Serves six."
  recipeContainer.appendChild(servingsEl)

  var calHeader = document.createElement("h3")
  calHeader.setAttribute("class", "nutrition-header")
  calHeader.textContent = "Calories (per serving): "
  recipeContainer.appendChild(calHeader)

  var calEl = document.createElement("h4")
  calEl.setAttribute("class", "nutrition-content")
  calEl.textContent = Math.round(totCals/6) + " kCal"
  recipeContainer.appendChild(calEl)

  var carbHeader = document.createElement("h3")
  carbHeader.setAttribute("class", "nutrition-header")
  carbHeader.textContent = "Carbs (per serving): "
  recipeContainer.appendChild(carbHeader)

  var carbEl = document.createElement("h4")
  carbEl.setAttribute("class", "nutrition-content")
  carbEl.textContent = Math.round(totCarbs/6) + "g"
  recipeContainer.appendChild(carbEl)

  var fatHeader = document.createElement("h3")
  fatHeader.setAttribute("class", "nutrition-header")
  fatHeader.textContent = "Fat (per serving): "
  recipeContainer.appendChild(fatHeader)

  var fatEl = document.createElement("h4")
  fatEl.setAttribute("class", "nutrition-content")
  fatEl.textContent = Math.round(totFat/6) + "g"
  recipeContainer.appendChild(fatEl)

  var protHeader = document.createElement("h3")
  protHeader.setAttribute("class", "nutrition-header")
  protHeader.textContent = "Protein (per serving): "
  recipeContainer.appendChild(protHeader)

  var protEl = document.createElement("h4")
  protEl.setAttribute("class", "nutrition-content")
  protEl.textContent = Math.round(totProtein/6) + "g"
  recipeContainer.appendChild(protEl)



}

  


