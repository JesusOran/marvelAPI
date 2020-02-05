var PRIV_KEY = "11714bc09f1cf0bcf86b196b5a86acd727b83c7f";
var PUBLIC_KEY = "b393fcb1fd503bbfc82d37cbe572313b";

var ts = new Date().getTime();
var hash = CryptoJS.MD5(ts + PRIV_KEY + PUBLIC_KEY).toString();
var main = $("#main");
var spinner = $("#spinner");
spinner.hide();
var labelBuscador = $("[for=buscador]");
var buscador = $("#buscador");
var buscarPersonaje;
var buscarComic;

labelBuscador.css({
  margin: "10px",
  display: "none"
});
buscador.css({
  margin: "10px",
  display: "none"
});

$("#showComics").click(function getComics() {
  spinner.show();
  buscarComic = true;
  buscarPersonaje = false;
  main.empty();
  labelBuscador.css("display", "block");
  buscador.css("display", "block");
  $.ajax({
    url: `https://gateway.marvel.com:443/v1/public/comics?ts=${ts}&apikey=${PUBLIC_KEY}&hash=${hash}`,
    method: "GET",
    data: {
      limit: 10
    },
    success: function(response) {
      createContent(response);
    },
    fail: function(err) {
      console.log(err);
    },
    complete: function() {
      spinner.hide();
    }
  });
});

$("#showCharacters").click(function getCharacters() {
  spinner.show();
  buscarPersonaje = true;
  buscarComic = false;
  main.empty();
  labelBuscador.css("display", "block");
  buscador.css("display", "block");

  $.ajax({
    url: `https://gateway.marvel.com:443/v1/public/characters?ts=${ts}&apikey=${PUBLIC_KEY}&hash=${hash}`,
    method: "GET",
    data: {
      limit: 10
    },
    success: function(response) {
      createContent(response);
    },
    fail: function(err) {
      console.log(err);
    },
    complete: function() {
      spinner.hide();
    }
  });
});

$("#buscador").keyup(function() {
  spinner.show();
  main.empty();
  var userSearch = $("#buscador").val();
  var comicSearch = `&titleStartsWith=${userSearch}`;
  var characterSeach = `&nameStartsWith=${userSearch}`;
  var finalSearch = "";
  var searchType = "";

  if (buscarComic === true) {
    finalSearch = comicSearch;
    searchType = "comics";
  } else if (buscarPersonaje == true) {
    finalSearch = characterSeach;
    searchType = "characters";
  }
  $.ajax({
    url: `https://gateway.marvel.com:443/v1/public/${searchType}?ts=${ts}&apikey=${PUBLIC_KEY}&hash=${hash}${finalSearch}`,
    method: "GET",
    data: {
      limit: 10
    },
    success: function(response) {
      createContent(response);
    },
    fail: function(err) {
      console.log(err);
    },
    complete: function() {
      spinner.hide();
    }
  });
});

function createContent(response) {
  main.empty();
  response.data.results.forEach(element => {
    var newContent = $("<div class='content'>");
    main.append(newContent);
    newContent.append(
      `<img src="${element.thumbnail.path}.${element.thumbnail.extension}">`
    );
    if (element.title === undefined) {
      newContent.append(`<h1>${element.name}</h1>`);
    } else {
      newContent.append(`<h1>${element.title}</h1>`);
    }
    if (element.description === null || element.description === "") {
      newContent.append(`<article><p>Sin descripción</p></article>`);
    } else {
      var fullText = element.description;
      var fullTextNum = fullText.length;
      var midText = fullTextNum / 2;
      var lessText = fullText.slice(0, midText) + "... ";
      var showMore = `<a class='showMore' href='#'>Leer más</a><span id="leerMenos">${fullText} <a class='showLess' href=""> Leer menos</a></span> `;
      newContent.append(`<article><p>${lessText}</p>${showMore}</article>`);
    }
  });
}

$(document).on("click", ".showMore", function(event) {
  event.preventDefault();
  $(event.target).hide();
  $(event.target)
    .prev()
    .hide();
  $(event.target)
    .nextAll()
    .show();
  $(event.target)
    .nextAll()
    .children()
    .show();
});

$(document).on("click", ".showLess", function(event) {
  event.preventDefault();
  $(event.target).hide();
  $(event.target)
    .parent()
    .hide();
  $(event.target)
    .parent()
    .prevAll()
    .show();
});

$(document).on("click", ".content > img", function(event) {
  $(event.target).nextAll().toggle();
})