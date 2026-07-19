import React, { useState, useMemo, useEffect } from "react";
import {
  MapPin, Phone, Clock, ShoppingCart, X, Plus, Minus, ChevronRight,
  Calendar, Users, CreditCard, Banknote, Check, Menu as MenuIcon,
  ArrowRight, Star, Pizza, Beef, Salad, Soup, UtensilsCrossed,
  Truck, Store, IceCream2, Flame, Search,
} from "lucide-react";

/* ============================================================
   DESIGN TOKENS — "La Carta" (helle italienische Menükarte)
   ============================================================ */
const C = {
  paper: "#FFF9F0",
  linen: "#F5EBDC",
  ink: "#2A1F1A",
  inkSoft: "#6B5D52",
  tomato: "#C7361F",
  tomatoDark: "#9E2A18",
  basil: "#3E6B3A",
  crust: "#E8A23D",
  line: "#E3D5C2",
};

const FONTS = `
  @import url('https://fonts.googleapis.com/css2?family=Alfa+Slab+One&family=Archivo:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Space+Mono:wght@400;700&display=swap');
`;

const F_DISPLAY = { fontFamily: "'Alfa Slab One', serif" };
const F_BODY = { fontFamily: "'Archivo', sans-serif" };
const F_MONO = { fontFamily: "'Space Mono', monospace" };

/* ============================================================
   MENU DATA — vollständige Speisekarte
   ============================================================ */
const CATEGORIES = [
  { id: "pizzen", label: "Pizzen", icon: Pizza, intro: "Alle Pizzen mit Tomatensauce und Käse." },
  { id: "pasta", label: "Pasta & Nudeln", icon: Soup, intro: "Nudeln nach Wahl: Maccaroni, Spaghetti, Tortellini oder Tagliatelle" },
  { id: "auflaeufe", label: "Aufläufe", icon: UtensilsCrossed },
  { id: "burger", label: "Burger & Schnitzel", icon: Beef, intro: "Alle Burger mit Pommes" },
  { id: "snacks", label: "Snacks & Beilagen", icon: UtensilsCrossed },
  { id: "broetchen", label: "Pizzabrötchen", icon: Pizza },
  { id: "salate", label: "Baguettes & Salate", icon: Salad, intro: [
    { label: "Baguettes", text: "Frisch aus dem Ofen. Mit Tomaten, Gurken, Mais, Eisbergsalat & Remoulade" },
    { label: "Salate", text: "Alle Salate mit 4 Brötchen und Kräuterbutter. Wählen Sie ihr Dressing: Joghurtsauce, Cocktailsauce, Honig-Balsamicoessig & Olivenöl/Essig" },
  ] },
  { id: "dessert", label: "Desserts & Getränke", icon: IceCream2 },
];

const MENU = [
  /* PIZZEN 1–52 */
  { id: "1", nr: 1, cat: "pizzen", name: "Margherita", desc: "Mit Tomatensauce und Käse", price: 7.0 },
  { id: "2", nr: 2, cat: "pizzen", name: "Salami", desc: "Salami", price: 8.0 },
  { id: "3", nr: 3, cat: "pizzen", name: "Cipolla", desc: "Zwiebeln", price: 8.0 },
  { id: "4", nr: 4, cat: "pizzen", name: "Napoli", desc: "Sardellen, Oliven, Peperoni, Knoblauch", price: 9.0 },
  { id: "5", nr: 5, cat: "pizzen", name: "Posaune", desc: "Zwiebeln, Champignons, Parmesan", price: 9.0 },
  { id: "6", nr: 6, cat: "pizzen", name: "Tonno", desc: "Thunfisch", price: 9.0 },
  { id: "7", nr: 7, cat: "pizzen", name: "Rustica", desc: "Formfleischvorderschinken, Champignons, Paprika", price: 9.0 },
  { id: "8", nr: 8, cat: "pizzen", name: "Mista", desc: "Salami, Formfleischvorderschinken, Thunfisch, Champignons", price: 9.5 },
  { id: "9", nr: 9, cat: "pizzen", name: "Calabrisella", desc: "Zwiebeln, Thunfisch", price: 9.5 },
  { id: "10", nr: 10, cat: "pizzen", name: "Completa", desc: "Formfleischvorderschinken, Zwiebeln, Champignons, Paprika", price: 9.5 },
  { id: "11", nr: 11, cat: "pizzen", name: "Capricciosa", desc: "Artischocken, Thunfisch, Formfleischvorderschinken, Champignons", price: 9.5 },
  { id: "12", nr: 12, cat: "pizzen", name: "Francese", desc: "Thunfisch, Formfleischvorderschinken, Weichkäse, Knoblauch, scharf", price: 9.5 },
  { id: "13", nr: 13, cat: "pizzen", name: "Inferno", desc: "Champignons, Peperoni, Salami, scharf", price: 9.0 },
  { id: "14", nr: 14, cat: "pizzen", name: "Diavolo", desc: "Paprika, Salami, Peperoni, scharf", price: 9.0 },
  { id: "15", nr: 15, cat: "pizzen", name: "Verdura", desc: "Spinat, Paprika, Broccoli, Artischocken, Knoblauch", price: 10.0 },
  { id: "16", nr: 16, cat: "pizzen", name: "Sara", desc: "Thunfisch, Mais, Weichkäse", price: 9.5 },
  { id: "17", nr: 17, cat: "pizzen", name: "Prosciutto", desc: "Formfleischvorderschinken", price: 8.0 },
  { id: "18", nr: 18, cat: "pizzen", name: "Pirata", desc: "Hackfleischsauce", price: 9.0 },
  { id: "19", nr: 19, cat: "pizzen", name: "Pirata spezial", desc: "Spaghetti mit Hackfleischsauce", price: 10.0 },
  { id: "20", nr: 20, cat: "pizzen", name: "Sofia", desc: "Spinat, Krabben, Thunfisch, Knoblauch", price: 10.0 },
  { id: "21", nr: 21, cat: "pizzen", name: "Frutti di Mare", desc: "Meeresfrüchte, Knoblauch", price: 10.5 },
  { id: "22", nr: 22, cat: "pizzen", name: "Scampi", desc: "Krabben, Knoblauch", price: 10.5 },
  { id: "23", nr: 23, cat: "pizzen", name: "Pasqualina", desc: "Hähnchenbrust (gebraten), Zwiebeln, Champignons, Knoblauch, scharf", price: 10.5 },
  { id: "24", nr: 24, cat: "pizzen", name: "Spinat", desc: "Spinat, Knoblauch", price: 9.0 },
  { id: "25", nr: 25, cat: "pizzen", name: "Zingara", desc: "Thunfisch, Champignons, Paprika, Artischocken, Formfleischvorderschinken", price: 10.0 },
  { id: "26", nr: 26, cat: "pizzen", name: "Funghi", desc: "Champignons", price: 8.5 },
  { id: "27", nr: 27, cat: "pizzen", name: "Enzo", desc: "Thunfisch, Zwiebeln, Krabben, Spinat, Knoblauch, scharf", price: 11.0 },
  { id: "28", nr: 28, cat: "pizzen", name: "Hawaii", desc: "Formfleischvorderschinken, Ananas", price: 9.0 },
  { id: "29", nr: 29, cat: "pizzen", name: "Sarda", desc: "Thunfisch, Zwiebeln, Sardellen, Knoblauch", price: 9.0 },
  { id: "30", nr: 30, cat: "pizzen", name: "Mamma", desc: "Thunfisch, Formfleischvorderschinken, Zwiebeln, Salami, Ei", price: 10.0 },
  { id: "31", nr: 31, cat: "pizzen", name: "4 Stagioni", desc: "Thunfisch, Champignons, Formfleischvorderschinken & Paprika", price: 9.5 },
  { id: "32", nr: 32, cat: "pizzen", name: "Italia", desc: "Frische Tomaten, Mozzarella, Spinat", price: 9.0 },
  { id: "33", nr: 33, cat: "pizzen", name: "4 Formaggi", desc: "4 Käsesorten", price: 9.5 },
  { id: "34", nr: 34, cat: "pizzen", name: "Ferrari", desc: "Thunfisch, Peperoni, Salami, Paprika, sehr scharf", price: 10.0 },
  { id: "35", nr: 35, cat: "pizzen", name: "Caramella", desc: "Spinat, Paprika, Zwiebeln, Knoblauch", price: 9.5 },
  { id: "36", nr: 36, cat: "pizzen", name: "Parma", desc: "Frische Tomaten, Rucola, Parmaschinken, Parmesan", price: 10.0 },
  { id: "37", nr: 37, cat: "pizzen", name: "Don", desc: "Frische Tomaten, Mozzarella, scharf", price: 9.5 },
  { id: "38", nr: 38, cat: "pizzen", name: "Simona", desc: "Thunfisch, Mais, Broccoli, Zwiebeln, Knoblauch", price: 10.0 },
  { id: "39", nr: 39, cat: "pizzen", name: "Bella", desc: "Thunfisch, Ananas, Formfleischvorderschinken", price: 9.5 },
  { id: "40", nr: 40, cat: "pizzen", name: "Hollandaise", desc: "Formfleischvorderschinken, Broccoli, Käse, Sc. Hollandaise (ohne Tomatensauce)", price: 10.0 },
  { id: "41", nr: 41, cat: "pizzen", name: "Anna", desc: "Frische Tomaten, Artischocken, Peperoni, Champignons, Broccoli und Mozzarella", price: 10.5 },
  { id: "42", nr: 42, cat: "pizzen", name: "Nimex", desc: "BBQ-Sauce, Mozzarella, Rinderhackfleisch, Zwiebeln, Goudakäse, Bacon", price: 11.0 },
  { id: "43", nr: 43, cat: "pizzen", name: "Calzone", desc: "Thunfisch, Zwiebeln, Champignons, Paprika, Peperoni, Käse", price: 9.5 },
  { id: "44", nr: 44, cat: "pizzen", name: "Familienpizza", desc: "40×40 cm rund mit zwei Zutaten", price: 18.0 },
  { id: "45", nr: 45, cat: "pizzen", name: "Marinella", desc: "Hähnchen, gebr. Gemüse", price: 11.0, neu: true },
  { id: "46", nr: 46, cat: "pizzen", name: "Amerika", desc: "Kartoffeln, frische Paprika, Zwiebeln", price: 10.0, neu: true },
  { id: "47", nr: 47, cat: "pizzen", name: "Tedesca", desc: "Hähnchen, Champignons, Erbsen, Sauce Hollandaise, Zwiebeln", price: 11.0, neu: true },
  { id: "48", nr: 48, cat: "pizzen", name: "Alaska", desc: "Lachs, Spinat, Knoblauch", price: 11.0, neu: true },
  { id: "49", nr: 49, cat: "pizzen", name: "Gyros", desc: "Gyros, frische Paprika, Zwiebeln", price: 11.0, neu: true },
  { id: "50", nr: 50, cat: "pizzen", name: "California", desc: "Auberginen, Zucchini, frische Paprika, Broccoli, Knoblauch", price: 10.0, neu: true },
  { id: "51", nr: 51, cat: "pizzen", name: "Santiago", desc: "Maccaroni, Thunfisch, Sahnesauce, scharf", price: 10.0, neu: true },
  { id: "52", nr: 52, cat: "pizzen", name: "Hollandaise spezial", desc: "Hähnchen, Champignons, Broccoli, fr. Paprika, Cocktailsauce", price: 12.0, neu: true },

  /* PASTA & NUDELN 121–166 */
  { id: "121", nr: 121, cat: "pasta", name: "Con Funghi", desc: "Champignons und Tomatensauce", price: 9.0 },
  { id: "122", nr: 122, cat: "pasta", name: "Napoli", desc: "Tomatensauce", price: 9.0 },
  { id: "123", nr: 123, cat: "pasta", name: "Bologna", desc: "Hackfleischsauce", price: 9.0 },
  { id: "124", nr: 124, cat: "pasta", name: "Carbonara", desc: "Speck, Formfleischvorderschinken, Ei, Sahnesauce", price: 9.5 },
  { id: "125", nr: 125, cat: "pasta", name: "Frutti di Mare", desc: "Meeresfrüchte und Knoblauch, Tomatensauce", price: 11.0 },
  { id: "126", nr: 126, cat: "pasta", name: "Al Gamberetti", desc: "Garnelen, Weißwein und Knoblauch, Tomatensahnesauce", price: 11.0 },
  { id: "127", nr: 127, cat: "pasta", name: "Al Tonno", desc: "Thunfisch und Sahnesauce", price: 9.5 },
  { id: "128", nr: 128, cat: "pasta", name: "Chef", desc: "Formfleischvorderschinken, Champignons, Knoblauch und Tomatensahnesauce", price: 10.0 },
  { id: "129", nr: 129, cat: "pasta", name: "Neo", desc: "In Olivenöl mit Hähnchenbrust, Aubergine, Pinienkernen, Rucola, Parmesankäse, scharf", price: 12.0 },
  { id: "130", nr: 130, cat: "pasta", name: "Panna", desc: "Formfleischvorderschinken, Sahnesauce", price: 9.5 },
  { id: "131", nr: 131, cat: "pasta", name: "Verdura", desc: "Zucchini, Auberginen, Knoblauch in Tomatensauce", price: 11.0 },
  { id: "134", nr: 134, cat: "pasta", name: "Noemi", desc: "Hähnchenbrust, Garnelen, Champignons, Knoblauch, Sahnesauce, scharf", price: 12.5 },
  { id: "135", nr: 135, cat: "pasta", name: "Parmigiani", desc: "Knoblauch, Öl, Oliven, Rucola, Pinienkernen, Parmesan, scharf", price: 10.5 },
  { id: "136", nr: 136, cat: "pasta", name: "Al Forno Due", desc: "Erbsen, Champignons, Mais, Sauce Hollandaise, mit Käse überbacken", price: 12.0 },
  { id: "137", nr: 137, cat: "pasta", name: "Broccoli", desc: "Broccoli und Knoblauch in Sahnesauce", price: 9.0 },
  { id: "138", nr: 138, cat: "pasta", name: "Alfredo", desc: "Formfleischvorderschinken, Champignons, Erbsen in Tomatensauce", price: 9.5 },
  { id: "139", nr: 139, cat: "pasta", name: "Gorgonzola", desc: "Gorgonzolakäse und Sahnesauce", price: 9.5 },
  { id: "140", nr: 140, cat: "pasta", name: "Aurora", desc: "Frische Tomaten, Auberginen, Basilikum, Mozzarella und Parmesan", price: 11.0 },
  { id: "141", nr: 141, cat: "pasta", name: "Panne Salmone e Rucola", desc: "Frischer Lachs und Rucola in Sahnesauce", price: 12.0 },
  { id: "142", nr: 142, cat: "pasta", name: "Tagliatelle Lachs", desc: "Lachsstücke, Sahnesauce", price: 11.5 },
  { id: "143", nr: 143, cat: "pasta", name: "4 Formaggio", desc: "Vier Käsesorten", price: 10.0 },
  { id: "144", nr: 144, cat: "pasta", name: "Marinella", desc: "Hähnchen, gebr. Gemüse, Tomaten, Sauce Hollandaise", price: 11.0 },
  { id: "145", nr: 145, cat: "pasta", name: "Alpaso", desc: "Champignons, Broccoli, Paprika, Käse überbacken, Tomatensahnesauce", price: 10.0 },
  { id: "146", nr: 146, cat: "pasta", name: "Alaska", desc: "Lachs, Spinat, Knoblauch, Sahnesauce", price: 11.0 },
  { id: "147", nr: 147, cat: "pasta", name: "Vulcano", desc: "Thunfisch, Paprika, Tomatensahnesauce, Käse überbacken, scharf", price: 10.0 },
  { id: "148", nr: 148, cat: "pasta", name: "Rosana", desc: "Champignons, Mozzarella, Tomatensahnesauce", price: 10.0 },
  { id: "149", nr: 149, cat: "pasta", name: "Al yoyo", desc: "Broccoli, Paprika, Zwiebeln, Erbsen, Bolognese-Sahnesauce, scharf", price: 10.0 },
  { id: "150", nr: 150, cat: "pasta", name: "Emilio", desc: "Formfleischvorderschinken, Champ., Erbsen, Sahnesauce", price: 10.0 },
  { id: "151", nr: 151, cat: "pasta", name: "Speziale", desc: "Hähnchen, Champ., Auberginen, Zucchini, Paprika, Sauce Hollandaise, Tomatensahnesauce, Käse überbacken", price: 12.0 },
  { id: "152", nr: 152, cat: "pasta", name: "Franki", desc: "Hähnchen, Champ., Paprika, Zwiebeln, Sauce Hollandaise, Tomatensahnesauce, Käse überbacken", price: 12.0 },
  { id: "153", nr: 153, cat: "pasta", name: "Valentina", desc: "Hähnchen, Champ., Broccoli, Paprika, Sauce Hollandaise, Tomatensahnesauce, Käse überbacken", price: 12.0 },
  { id: "163", nr: 163, cat: "pasta", name: "Lasagne al Forno", desc: "Rinderhackfleischsauce", price: 9.5 },
  { id: "164", nr: 164, cat: "pasta", name: "Cannelloni al Forno", desc: "Gefüllt mit Schweine- und Rindfleisch", price: 9.5 },
  { id: "165", nr: 165, cat: "pasta", name: "Combinazione al Forno", desc: "Tortellini, Cannelloni gefüllt mit Schweine- und Rindfleisch und Lasagne", price: 9.5 },
  { id: "166", nr: 166, cat: "pasta", name: "Nudeln nach Wahl al Forno", desc: "Formfleischvorderschinken, Champ., Ei, Käse überbacken, Tomatensahnesauce", price: 9.5 },

  /* AUFLÄUFE 80–85, 181–188 */
  { id: "80", nr: 80, cat: "auflaeufe", name: "Lachs-Kartoffelpfanne", desc: "Lachswürfel, Kartoffeln, Zwiebeln, Sahnesauce, Goudakäse, überbacken", price: 11.0 },
  { id: "81", nr: 81, cat: "auflaeufe", name: "Lachs Broccoli Champignons", desc: "Lachswürfel, Broccoli, fr. Champignons, Sahnesauce, Goudakäse, überbacken", price: 11.0 },
  { id: "82", nr: 82, cat: "auflaeufe", name: "Hollandaise Auflauf", desc: "Kartoffeln, Sauce Hollandaise, Broccoli, Hähnchenbrust, Goudakäse, überbacken", price: 11.0 },
  { id: "83", nr: 83, cat: "auflaeufe", name: "Kartoffel Auflauf", desc: "Tomaten-Sahnesauce, Kartoffeln, Auberginen, Paprika, Goudakäse, überbacken", price: 11.0 },
  { id: "84", nr: 84, cat: "auflaeufe", name: "Bacon Auflauf", desc: "Kartoffeln, Tomaten-Sahnesauce, Speck, Goudakäse, überbacken", price: 11.0 },
  { id: "85", nr: 85, cat: "auflaeufe", name: "Marinella Auflauf", desc: "Kartoffeln, Garnelen, Tomaten-Sahnesauce, scharf, Knoblauch, Goudakäse, überbacken", price: 11.0 },
  { id: "181", nr: 181, cat: "auflaeufe", name: "Spinaci al Forno", desc: "Spinat, Knoblauch, Käse und Tomatensahnesauce", price: 9.5 },
  { id: "182", nr: 182, cat: "auflaeufe", name: "Funghi al Forno", desc: "Champignons, Knoblauch, Tomatensauce, mit Käse überbacken", price: 9.5 },
  { id: "183", nr: 183, cat: "auflaeufe", name: "Broccoli al Forno", desc: "Broccoli, Knoblauch, Tomatensahnesauce, mit Käse überbacken", price: 9.5 },
  { id: "184", nr: 184, cat: "auflaeufe", name: "Zucchini al Forno", desc: "Zucchini, Tomaten, Gewürze, Knoblauch, Tomatensahnesauce, mit Käse überbacken", price: 9.5 },
  { id: "185", nr: 185, cat: "auflaeufe", name: "Gemüse Auflauf", desc: "Tomaten-Sahnesauce, fr. Auberginen, fr. Zucchini, fr. Paprika, fr. Champignons, Mozzarella überbacken", price: 11.0 },
  { id: "186", nr: 186, cat: "auflaeufe", name: "Gemüse Combinazione", desc: "Broccoli, Auberginen, Zucchini, Paprika, Tomaten-Sahnesauce, Knoblauch, mit Käse überbacken", price: 11.0 },
  { id: "187", nr: 187, cat: "auflaeufe", name: "Broccoli Gratin", desc: "Broccoli, Kartoffeln, Schinken, in Sauce Hollandaise, mit Käse überbacken", price: 11.0 },
  { id: "188", nr: 188, cat: "auflaeufe", name: "Vegetarische Lasagne", desc: "Tomatensahnesauce, überbacken", price: 11.0 },

  /* BURGER & SCHNITZEL 238–254 */
  { id: "238", nr: 238, cat: "burger", name: "Hamburger", desc: "180 g Irish Beef, Burgersauce, Tomaten, Gurke, Salat — mit Pommes", price: 12.5 },
  { id: "239", nr: 239, cat: "burger", name: "Cheeseburger", desc: "180 g Irish Beef, Cheddarkäse, Burgersauce, Tomaten, Gurke, Salat — mit Pommes", price: 13.5 },
  { id: "240", nr: 240, cat: "burger", name: "Crispy Chickenburger", desc: "180 g Hähnchenbrust, Teriyaki-Chilisauce, Tomaten, Gurke, Salat, Sweet-Chilisauce — mit Pommes", price: 13.5 },
  { id: "241", nr: 241, cat: "burger", name: "Hamburger Spezial", desc: "180 g Irish Beef, Burgersauce, Zwiebeln, Jalapeños,tomaten,gurken ,Cheddarkäse — mit Pommes", price: 13.5 },
  { id: "242", nr: 242, cat: "burger", name: "Veggi Hamburger", desc: "Zwiebeln, Champignons, Paprika, Tomaten, Gurke, Salat, Cheddarkäse, Burgersauce, Ketchup — mit Pommes", price: 13.5 },
  { id: "243", nr: 243, cat: "burger", name: "Bacon Chili Cheese Burger", desc: "180 g Irish Beef, Cheddarkäse, Bacon, Jalapeños, Tomaten, Gurke, Cheddar Sauce — mit Pommes", price: 13.5, neu: true },
  { id: "245", nr: 245, cat: "burger", name: "Schnitzel Wiener Art", desc: "Incl. einer Beilage Pommes Frites", price: 10.0 },
  { id: "246", nr: 246, cat: "burger", name: "Zigeunerschnitzel", desc: "Incl. einer Beilage Pommes Frites", price: 12.0 },
  { id: "247", nr: 247, cat: "burger", name: "Jägerschnitzel", desc: "Incl. einer Beilage Pommes Frites", price: 12.0 },
  { id: "248", nr: 248, cat: "burger", name: "Schnitzel Hollandaise", desc: "Broccoli, Sauce Hollandaise, einer Beilage Pommes Frites", price: 12.0 },
  { id: "249", nr: 249, cat: "burger", name: "Hähnchenschnitzel", desc: "Paniert, mit einer Beilage Pommes Frites", price: 10.0 },
  { id: "250", nr: 250, cat: "burger", name: "Rahmschnitzel", desc: "Incl. einer Beilage Pommes Frites", price: 12.0 },
  { id: "251", nr: 251, cat: "burger", name: "Chicken Nuggets", desc: "12 Stück mit Pommes & zwei Saucen", price: 10.0 },
  { id: "252", nr: 252, cat: "burger", name: "Chicken Wings", desc: "8 Hähnchenflügel, pikant, mit Pommes", price: 10.0 },
  { id: "253", nr: 253, cat: "burger", name: "Zwiebelschnitzel", desc: "Incl. einer Beilage Pommes Frites", price: 12.0, neu: true },
  { id: "254", nr: 254, cat: "burger", name: "Schnitzel Hawaii", desc: "Formfleischvorderschinken, Ananas, Sahnesauce, Käse überbacken, einer Beilage Pommes Frites", price: 12.0, neu: true },

  /* SNACKS & BEILAGEN 90–92, 255–257 */
  { id: "90", nr: 90, cat: "snacks", name: "Beef Chili Cheese Fries", desc: "Cheddarkäse, Irish Beef Rinderhackfleisch & Jalapeños, überbacken", price: 10.0 },
  { id: "91", nr: 91, cat: "snacks", name: "Chicken Chili Cheese Fries", desc: "Cheddarkäse, saftige Hähnchenbrustfilets & Jalapeños, überbacken", price: 10.0 },
  { id: "92", nr: 92, cat: "snacks", name: "Vegetaria Chili Cheese Fries", desc: "Fr. Paprika, Champignons, Frühlingszwiebeln, Jalapeños & Cheddarkäse, überbacken", price: 10.0 },
  { id: "255", nr: 255, cat: "snacks", name: "Bratkartoffeln", desc: "Mit Zwiebeln", price: 4.0 },
  { id: "256", nr: 256, cat: "snacks", name: "Pommes-Frites", desc: "", price: 4.0 },
  { id: "257", nr: 257, cat: "snacks", name: "Kroketten", desc: "", price: 4.0 },

  /* PIZZABRÖTCHEN 101–111 */
  { id: "101", nr: 101, cat: "broetchen", name: "Pizzabrötchen", desc: "6 Stück mit Kräuterbutter oder Aioli", price: 3.0 },
  { id: "102", nr: 102, cat: "broetchen", name: "Schinkenbrötchen", desc: "Gefüllt mit Käse und Formfleischvorderschinken", price: 6.5 },
  { id: "103", nr: 103, cat: "broetchen", name: "Thunfischbrötchen", desc: "Gefüllt mit Käse und Thunfisch", price: 6.5 },
  { id: "104", nr: 104, cat: "broetchen", name: "Käsebrötchen", desc: "Gefüllt mit Käse", price: 6.5 },
  { id: "105", nr: 105, cat: "broetchen", name: "Hawaiibrötchen", desc: "Gefüllt mit Käse, Formfleischvorderschinken und Ananas", price: 7.5 },
  { id: "106", nr: 106, cat: "broetchen", name: "Salamibrötchen", desc: "Gefüllt mit Käse, Salami", price: 6.5 },
  { id: "107", nr: 107, cat: "broetchen", name: "Spinacibrötchen", desc: "Gefüllt mit Käse, Spinat, Hirtenkäse", price: 7.5 },
  { id: "108", nr: 108, cat: "broetchen", name: "Rucolabrötchen", desc: "Gefüllt mit frischen Tomaten, Rucola, Mozzarella", price: 7.5 },
  { id: "109", nr: 109, cat: "broetchen", name: "Gyrosbrötchen", desc: "Gefüllt mit Gyros, Zwiebeln", price: 7.5 },
  { id: "110", nr: 110, cat: "broetchen", name: "Hähnchenbrötchen", desc: "Gefüllt mit Käse und Hähnchenstreifen", price: 7.5, neu: true },
  { id: "111", nr: 111, cat: "broetchen", name: "Nutellabrötchen", desc: "Gefüllt mit Nutella", price: 6.5, neu: true },

  /* BAGUETTES & SALATE 350–378 */
  { id: "350", nr: 350, cat: "salate", name: "Baguette Käse", desc: "Mit Käse", price: 7.0 },
  { id: "351", nr: 351, cat: "salate", name: "Baguette Thunfisch", desc: "Mit Käse und Zwiebeln", price: 7.0 },
  { id: "352", nr: 352, cat: "salate", name: "Baguette Hawaii", desc: "Mit Ananas, Käse und Formfleischvorderschinken", price: 7.0 },
  { id: "353", nr: 353, cat: "salate", name: "Baguette Schinken", desc: "Mit Käse und Formfleischvorderschinken", price: 7.5 },
  { id: "354", nr: 354, cat: "salate", name: "Baguette Salami", desc: "Mit Käse", price: 7.5 },
  { id: "355", nr: 355, cat: "salate", name: "Baguette Mozzarella", desc: "Mit Mozzarella", price: 7.0 },
  { id: "356", nr: 356, cat: "salate", name: "Baguette Chicken", desc: "Mit Hähnchenschnitzel", price: 8.5 },
  { id: "357", nr: 357, cat: "salate", name: "Baguette Schnitzel", desc: "Vom Schwein", price: 8.5 },
  { id: "358", nr: 358, cat: "salate", name: "Baguette mit Ei", desc: "", price: 7.0 },
  { id: "359", nr: 359, cat: "salate", name: "Baguette Parma", desc: "Mit Parmaschinken, Rucola", price: 8.0 },
  { id: "359a", nr: "359a", cat: "salate", name: "Baguette Marinella", desc: "Mit Hähnchen, gebr. Gemüse", price: 9.0, neu: true },
  { id: "359b", nr: "359b", cat: "salate", name: "Baguette Burger", desc: "Mit Burgerfleisch, Zwiebeln", price: 8.5, neu: true },
  { id: "360", nr: 360, cat: "salate", name: "Insalata Mista", desc: "Gemischter Salat — mit 4 Brötchen und Kräuterbutter", price: 7.0 },
  { id: "361", nr: 361, cat: "salate", name: "Gurkensalat", desc: "Mit Gurken", price: 7.0 },
  { id: "362", nr: 362, cat: "salate", name: "Tomatensalat", desc: "Mit Tomaten", price: 7.0 },
  { id: "363", nr: 363, cat: "salate", name: "Insalata Tonno", desc: "Gem. Salat, Thunfisch, Zwiebeln", price: 8.5 },
  { id: "364", nr: 364, cat: "salate", name: "Insalata Capricciosa", desc: "Gem. Salat, Thunfisch, Formfleischvorderschinken, Käse", price: 9.0 },
  { id: "365", nr: 365, cat: "salate", name: "Salat Pollo", desc: "Gem. Salat, gebr. Hähnchenbrustfilet, Rucola", price: 10.0 },
  { id: "366", nr: 366, cat: "salate", name: "Mozzarella Salat", desc: "Fr. Tomaten, Mozzarella, Basilikum", price: 8.5 },
  { id: "367", nr: 367, cat: "salate", name: "Bauernsalat", desc: "Gem. Salat, Oliven, Weichkäse, Peperoni, Zwiebeln, fr. Paprika", price: 8.5 },
  { id: "368", nr: 368, cat: "salate", name: "Hawaii Spezial", desc: "Gem. Salat, Ananas, Formfleischvorderschinken", price: 8.5 },
  { id: "369", nr: 369, cat: "salate", name: "Shrimpssalat", desc: "Gem. Salat, Shrimps, Ananas", price: 10.0 },
  { id: "370", nr: 370, cat: "salate", name: "Gourmetsalat", desc: "Gem. Salat, Käse, Formfleischvorderschinken und Hähnchenbrustfilet", price: 9.5 },
  { id: "371", nr: 371, cat: "salate", name: "Chicken Salat", desc: "Gem. Salat, Hähnchenbrustfilet", price: 9.0 },
  { id: "372", nr: 372, cat: "salate", name: "Rucola Salat", desc: "Fr. Tomaten, Parmesankäse, Rucola", price: 8.5 },
  { id: "373", nr: 373, cat: "salate", name: "Salmone Salat", desc: "Gem. Salat mit gebratenem Lachs", price: 10.0 },
  { id: "374", nr: 374, cat: "salate", name: "Della Mare Salat", desc: "Gem. Salat, gebratene Garnelen", price: 10.0 },
  { id: "375", nr: 375, cat: "salate", name: "Salat Funghi", desc: "Gem. Salat, gebr. Champignons, Rucola & Lachs", price: 11.0 },
  { id: "376", nr: 376, cat: "salate", name: "Garnelensalat", desc: "Gem. Salat, gebr. Garnelen & Rucola", price: 11.0 },
  { id: "377", nr: 377, cat: "salate", name: "Marinella Salat", desc: "Gem. Salat mit Hähnchen, gebr. Gemüse", price: 10.5 },
  { id: "378", nr: 378, cat: "salate", name: "Adomani Salat", desc: "Gem. Salat mit Thunfisch, Formfleischvorderschinken, Käse, Ei, Krabben", price: 10.0 },

  /* DESSERTS & GETRÄNKE */
  { id: "301", nr: 301, cat: "dessert", name: "Tiramisu", desc: "Hausgemacht", price: 5.0 },
  { id: "302", nr: 302, cat: "dessert", name: "Ben & Jerry's Eis", desc: "100 ml, Schokolade oder Cookies", price: 5.0 },
  { id: "303", nr: 303, cat: "dessert", name: "Ben & Jerry's Eis", desc: "500 ml, Schokolade oder Cookies", price: 10.0 },
  { id: "500", nr: 500, cat: "dessert", name: "Softdrinks 0,33 l", desc: "Sprite, Fanta, Cola, Cola light oder Wasser", price: 2.5 },
  { id: "501", nr: 501, cat: "dessert", name: "Softdrinks 1 l", desc: "Sprite, Fanta, Cola, Cola light oder Wasser", price: 3.5 },
  { id: "502", nr: 502, cat: "dessert", name: "Bier 0,5 l", desc: "Bitburger, Becks, Diebels oder Malzbier", price: 3.0 },
  { id: "503", nr: 503, cat: "dessert", name: "Lambrusco 0,75 l", desc: "Rotwein", price: 10.0 },
  { id: "504", nr: 504, cat: "dessert", name: "Lambrusco 0,25 l", desc: "Rotwein", price: 5.0 },
  { id: "505", nr: 505, cat: "dessert", name: "Wein 0,75 l", desc: "Weisswein, Rosé oder Rotwein", price: 9.0 },
  { id: "506", nr: 506, cat: "dessert", name: "Pinot Grigio 0,75 l", desc: "", price: 10.0 },
  { id: "507", nr: 507, cat: "dessert", name: "Durstlöscher 0,25 l", desc: "", price: 2.0 },
  { id: "508", nr: 508, cat: "dessert", name: "Wodka 0,7 l", desc: "", price: 20.0 },
  { id: "509", nr: 509, cat: "dessert", name: "Whisky 0,7 l", desc: "", price: 20.0 },
];

const fmt = (n) => n.toFixed(2).replace(".", ",") + " €";

/* ============================================================
   SIGNATURE — gingham strip + cash sticker
   ============================================================ */
function GinghamStrip({ height = 14 }) {
  return (
    <svg width="100%" height={height} aria-hidden="true" style={{ display: "block" }}>
      <defs>
        <pattern id="gingham" width="28" height="28" patternUnits="userSpaceOnUse">
          <rect width="28" height="28" fill={C.paper} />
          <rect width="14" height="14" fill={`${C.tomato}55`} />
          <rect x="14" y="14" width="14" height="14" fill={`${C.tomato}55`} />
          <rect x="14" width="14" height="14" fill={`${C.tomato}22`} />
          <rect y="14" width="14" height="14" fill={`${C.tomato}22`} />
        </pattern>
      </defs>
      <rect width="100%" height={height} fill="url(#gingham)" />
    </svg>
  );
}

function CashSticker({ size = 150, rotate = 8 }) {
  return (
    <div className="relative flex items-center justify-center shrink-0 select-none" style={{ width: size, height: size, transform: `rotate(${rotate}deg)` }}>
      <svg viewBox="0 0 120 120" width={size} height={size} className="absolute inset-0 drop-shadow-md">
        <circle cx="60" cy="60" r="58" fill={C.tomato} />
        <circle cx="60" cy="60" r="50" fill="none" stroke={C.paper} strokeWidth="2" strokeDasharray="4 4" />
      </svg>
      <div className="relative flex flex-col items-center text-center leading-none" style={{ color: C.paper }}>
        <span style={{ ...F_MONO, fontSize: size * 0.055, letterSpacing: "0.15em" }} className="uppercase mb-1">Bar zahlen</span>
        <span style={{ ...F_DISPLAY, fontSize: size * 0.24 }}>-10%</span>
        <span style={{ ...F_MONO, fontSize: size * 0.05, letterSpacing: "0.12em" }} className="uppercase mt-1">Rabatt</span>
      </div>
    </div>
  );
}

function useIsOpen() {
  const [open, setOpen] = useState(true);
  useEffect(() => {
    const check = () => {
      const now = new Date();
      const day = now.getDay();
      const h = now.getHours() + now.getMinutes() / 60;
      const isWeekend = day === 0 || day === 6;
      const start = isWeekend ? 12 : 11.5;
      const end = isWeekend ? 22.5 : 22;
      setOpen(h >= start && h < end);
    };
    check();
    const id = setInterval(check, 60000);
    return () => clearInterval(id);
  }, []);
  return open;
}

/* ============================================================
   NAVBAR
   ============================================================ */
function Navbar({ view, setView, cartCount, onCartClick, mobileOpen, setMobileOpen }) {
  const isOpen = useIsOpen();
  const links = [
    { id: "home", label: "Start" },
    { id: "menu", label: "Speisekarte" },
    { id: "reservation", label: "Reservieren" },
  ];
  return (
    <header className="sticky top-0 z-40 w-full" style={{ backgroundColor: C.paper }}>
      <GinghamStrip height={10} />
      <div className="border-b" style={{ borderColor: C.line }}>
        <div className="max-w-6xl mx-auto px-5 sm:px-8 h-20 flex items-center justify-between">
          <button onClick={() => setView("home")} className="flex items-center gap-3">
            <img src="/logo.png" alt="Pizzeria Marinella Logo" className="w-12 h-12 object-contain shrink-0" />
            <div className="text-left">
              <div style={{ ...F_DISPLAY, color: C.tomato }} className="text-lg leading-tight">Marinella</div>
              <div style={{ ...F_MONO, color: C.inkSoft, letterSpacing: "0.16em" }} className="text-[10px] uppercase leading-tight">
                Pizzeria · Korschenbroich
              </div>
            </div>
          </button>

          <nav className="hidden md:flex items-center gap-7">
            <span style={{ backgroundColor: isOpen ? C.basil : C.tomatoDark, ...F_MONO }} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] uppercase text-white">
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
              {isOpen ? "Jetzt geöffnet" : "Geschlossen"}
            </span>
            {links.map((l) => (
              <button key={l.id} onClick={() => setView(l.id)} style={F_BODY} className="text-sm font-semibold uppercase tracking-wide">
                <span style={{ color: view === l.id ? C.tomato : C.ink }}>{l.label}</span>
              </button>
            ))}
            <button onClick={() => setView("menu")} style={{ backgroundColor: C.tomato, ...F_BODY }} className="px-5 py-2.5 rounded-lg text-sm font-bold text-white uppercase tracking-wide hover:opacity-90 transition-opacity">
              Online Bestellen
            </button>
          </nav>

          <div className="flex items-center gap-2">
            <button onClick={onCartClick} className="relative w-11 h-11 rounded-lg flex items-center justify-center border-2" style={{ borderColor: C.ink, backgroundColor: C.paper }}>
              <ShoppingCart size={19} color={C.ink} />
              {cartCount > 0 && (
                <span style={{ backgroundColor: C.tomato, ...F_MONO }} className="absolute -top-2 -right-2 w-5 h-5 rounded-full text-[10px] flex items-center justify-center text-white font-bold">
                  {cartCount}
                </span>
              )}
            </button>
            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden w-11 h-11 rounded-lg flex items-center justify-center border-2" style={{ borderColor: C.ink, backgroundColor: C.paper }}>
              <MenuIcon size={19} color={C.ink} />
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden border-t px-5 py-4 flex flex-col" style={{ borderColor: C.line }}>
            {links.map((l) => (
              <button key={l.id} onClick={() => { setView(l.id); setMobileOpen(false); }} style={{ ...F_BODY, borderColor: C.line, color: view === l.id ? C.tomato : C.ink }} className="text-left py-3 text-sm font-semibold uppercase tracking-wide border-b">
                {l.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}

/* ============================================================
   HERO
   ============================================================ */
function Hero({ setView }) {
  return (
    <section style={{ backgroundColor: C.paper }} className="relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-14 pb-20 md:pt-20 md:pb-24">
        <div className="grid md:grid-cols-[1.2fr_1fr] gap-12 items-center">
          <div>
            <div className="flex items-center gap-2 mb-7">
              <span className="h-1 w-8 rounded-full" style={{ backgroundColor: C.basil }} />
              <span className="h-1 w-8 rounded-full" style={{ backgroundColor: C.paper, border: `1px solid ${C.line}` }} />
              <span className="h-1 w-8 rounded-full" style={{ backgroundColor: C.tomato }} />
              <span style={{ ...F_MONO, color: C.inkSoft, letterSpacing: "0.2em" }} className="text-xs uppercase ml-2">
                Rochusstraße 2–4 · Korschenbroich
              </span>
            </div>
            <h1 style={{ ...F_DISPLAY, color: C.ink, lineHeight: 1.05 }} className="text-4xl sm:text-5xl md:text-6xl mb-3">Steinofen-Pizza,</h1>
            <h1 style={{ ...F_DISPLAY, color: C.tomato, lineHeight: 1.05 }} className="text-4xl sm:text-5xl md:text-6xl mb-7">wie in Italia.</h1>
            <p style={{ ...F_BODY, color: C.inkSoft }} className="text-lg max-w-md mb-9 leading-relaxed">
              Original italienische Pizza aus dem Steinofen und handgemachte Burger — frisch bestellt, heiß geliefert oder abgeholt.
            </p>
            <div className="flex flex-wrap gap-4">
              <button onClick={() => setView("menu")} style={{ backgroundColor: C.tomato, ...F_BODY }} className="px-7 py-4 rounded-lg text-sm font-bold text-white uppercase tracking-wide flex items-center gap-2 hover:opacity-90 transition-opacity">
                Online Bestellen <ArrowRight size={16} />
              </button>
              <button onClick={() => setView("reservation")} style={{ ...F_BODY, border: `2px solid ${C.ink}`, color: C.ink }} className="px-7 py-4 rounded-lg text-sm font-bold uppercase tracking-wide flex items-center gap-2">
                Tisch Reservieren <Calendar size={16} />
              </button>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-sm">
            <div className="rounded-2xl overflow-hidden rotate-1" style={{ border: `10px solid white`, boxShadow: "0 18px 40px rgba(42,31,26,0.18)" }}>
              <img src="/hero.jpg" alt="Frische Steinofen-Pizza" className="w-full h-72 sm:h-80 object-cover" />
            </div>
            <div className="absolute -bottom-8 -left-6">
              <CashSticker size={130} />
            </div>
          </div>
        </div>
      </div>
      <GinghamStrip />
    </section>
  );
}

/* ============================================================
   ABOUT STRIP
   ============================================================ */
function AboutStrip() {
  const items = [
    { icon: Flame, title: "Steinofen", text: "Original italienisch." },
    { icon: Truck, title: "Lieferung & Abholung", text: "Lieferung ca. 30 Min · Abholung ca. 15 Min — heiß zu dir oder zum Mitnehmen." },
    { icon: Banknote, title: "10 % bar sparen", text: "Bar zahlen bei Lieferung oder Abholung — Rabatt automatisch." },
  ];
  return (
    <section style={{ backgroundColor: C.linen }} className="py-14">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 grid sm:grid-cols-3 gap-8">
        {items.map((it, i) => (
          <div key={i} className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: C.paper, border: `2px solid ${C.tomato}` }}>
              <it.icon size={20} color={C.tomato} />
            </div>
            <div>
              <div style={{ ...F_BODY, color: C.ink, fontWeight: 700 }} className="text-base mb-1 uppercase tracking-wide">{it.title}</div>
              <div style={{ ...F_BODY, color: C.inkSoft }} className="text-sm leading-relaxed">{it.text}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ============================================================
   MENU / ORDERING VIEW  (mit Suche + Nummern)
   ============================================================ */
function MenuRow({ item, inCart, onAdd }) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2">
          <span style={{ ...F_MONO, color: C.inkSoft }} className="text-xs shrink-0">{item.nr}.</span>
          <span style={{ ...F_BODY, color: C.ink, fontWeight: 600 }} className="text-base shrink-0">{item.name}</span>
          {item.neu && (
            <span style={{ ...F_MONO, backgroundColor: C.tomato, color: "white" }} className="text-[9px] px-1.5 py-0.5 rounded uppercase shrink-0">Neu</span>
          )}
          <span className="flex-1 border-b border-dotted translate-y-[-4px]" style={{ borderColor: C.inkSoft }} />
          <span style={{ ...F_MONO, color: C.tomato, fontWeight: 700 }} className="text-sm shrink-0">{fmt(item.price)}</span>
        </div>
        {item.desc && <div style={{ ...F_BODY, color: C.inkSoft }} className="text-sm mt-1 pl-6">{item.desc}</div>}
      </div>
      <button
        onClick={() => onAdd(item)}
        aria-label={`${item.name} in den Warenkorb`}
        style={{ backgroundColor: inCart ? C.basil : C.tomato }}
        className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-white hover:opacity-90 transition-opacity mt-0.5"
      >
        {inCart ? <Check size={16} /> : <Plus size={16} />}
      </button>
    </div>
  );
}

function MenuView({ cart, addToCart }) {
  const [activeCat, setActiveCat] = useState("pizzen");
  const [query, setQuery] = useState("");

  const searching = query.trim().length > 0;
  const q = query.trim().toLowerCase();

  const results = useMemo(() => {
    if (searching) {
      return MENU.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.desc.toLowerCase().includes(q) ||
          String(m.nr).toLowerCase() === q
      );
    }
    return MENU.filter((m) => m.cat === activeCat);
  }, [searching, q, activeCat]);

  return (
    <section style={{ backgroundColor: C.paper }} className="py-14">
      <div className="max-w-5xl mx-auto px-5 sm:px-8">
        <div className="text-center mb-8">
          <span style={{ ...F_MONO, color: C.basil, letterSpacing: "0.22em" }} className="text-xs uppercase">La Carta</span>
          <h2 style={{ ...F_DISPLAY, color: C.ink }} className="text-3xl sm:text-4xl mt-2">Online Bestellen</h2>
        </div>

        {/* Suche */}
        <div className="max-w-md mx-auto mb-8 relative">
          <Search size={18} color={C.inkSoft} className="absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Suchen (z. B. Thunfisch, Nr. 42 …)"
            style={{ backgroundColor: "white", border: `2px solid ${C.line}`, color: C.ink, ...F_BODY }}
            className="w-full pl-11 pr-10 py-3 rounded-lg text-sm outline-none focus:border-2"
          />
          {searching && (
            <button onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: C.linen }}>
              <X size={13} color={C.ink} />
            </button>
          )}
        </div>

        {/* Kategorien (versteckt bei Suche) */}
        {!searching && (
          <div className="flex gap-2 overflow-x-auto pb-3 mb-10 sm:flex-wrap sm:justify-center">
            {CATEGORIES.map((c) => {
              const Icon = c.icon;
              const active = activeCat === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => setActiveCat(c.id)}
                  style={{ backgroundColor: active ? C.tomato : C.paper, border: `2px solid ${active ? C.tomato : C.ink}`, color: active ? "white" : C.ink, ...F_BODY }}
                  className="shrink-0 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wide flex items-center gap-2 transition-colors"
                >
                  <Icon size={14} />
                  {c.label}
                </button>
              );
            })}
          </div>
        )}

        {/* Karte */}
        <div className="rounded-2xl p-7 sm:p-10" style={{ backgroundColor: "white", border: `1px solid ${C.line}`, boxShadow: "0 10px 30px rgba(42,31,26,0.07)" }}>
          {!searching && (() => {
            const cat = CATEGORIES.find((c) => c.id === activeCat);
            if (!cat || !cat.intro) return null;
            const intros = Array.isArray(cat.intro) ? cat.intro : [{ text: cat.intro }];
            return (
              <div className="mb-7 pb-6 border-b" style={{ borderColor: C.line }}>
                {intros.map((it, i) => (
                  <div key={i} className={i > 0 ? "mt-3" : ""}>
                    {it.label && (
                      <span style={{ ...F_MONO, color: C.tomato, letterSpacing: "0.1em", fontWeight: 700 }} className="text-[11px] uppercase block mb-1">{it.label}</span>
                    )}
                    <span style={{ ...F_BODY, color: C.tomato, fontWeight: 600 }} className="text-sm leading-relaxed">{it.text}</span>
                  </div>
                ))}
              </div>
            );
          })()}
          {searching && (
            <div style={{ ...F_MONO, color: C.inkSoft }} className="text-xs uppercase mb-6">
              {results.length} {results.length === 1 ? "Ergebnis" : "Ergebnisse"} für „{query}“
            </div>
          )}
          {results.length === 0 ? (
            <div style={{ ...F_BODY, color: C.inkSoft }} className="text-sm text-center py-8">
              Nichts gefunden. Versuch einen anderen Begriff.
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-x-12 gap-y-7">
              {results.map((item) => (
                <MenuRow key={item.id} item={item} inCart={!!cart.find((c) => c.id === item.id)} onAdd={addToCart} />
              ))}
            </div>
          )}

          {/* Hinweis nur bei Pizzen */}
          {!searching && activeCat === "pizzen" && (
            <div style={{ ...F_BODY, color: C.inkSoft, borderColor: C.line }} className="text-xs mt-8 pt-6 border-t">
              Jede weitere Zutat: 1,50 – 3,00 €.
            </div>
          )}
        </div>

        {/* Zusatzstoffe & Allergene — immer sichtbar unten */}
        <div className="mt-8 rounded-xl p-5 sm:p-6" style={{ backgroundColor: C.linen, border: `1px solid ${C.line}` }}>
          <div className="mb-3">
            <span style={{ ...F_MONO, color: C.ink, fontWeight: 700, letterSpacing: "0.08em" }} className="text-[11px] uppercase">Zusatzstoffe</span>
            <p style={{ ...F_BODY, color: C.inkSoft }} className="text-[11px] leading-relaxed mt-1">
              1: mit Farbstoff(en) · 2: mit Konservierungsstoff(en) · 3: mit Antioxidationsmittel · 4: mit Geschmacksverstärker(n) · 5: mit Schwefeldioxid · 6: mit Schwärzungsmittel · 7: mit Phosphat · 8: mit Milcheiweiß · 9: koffeinhaltig · 10: chininhaltig · 11: mit Süßungsmittel · 12: enthält eine Phenylalaninquelle · 13: gewachst · 14: mit Taurin
            </p>
          </div>
          <div>
            <span style={{ ...F_MONO, color: C.ink, fontWeight: 700, letterSpacing: "0.08em" }} className="text-[11px] uppercase">Allergene</span>
            <p style={{ ...F_BODY, color: C.inkSoft }} className="text-[11px] leading-relaxed mt-1">
              a: enthält glutenhaltiges Getreide · b: enthält Krebstiere · c: enthält Eier · d: enthält Fische · f: enthält Soja · g: enthält Milch · h: enthält Schalenfrüchte · i: enthält Sellerie · j: enthält Senf · k: enthält Sesam · l: enthält Sulfit · m: enthält Lupine · n: enthält Weichtiere
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   CART DRAWER
   ============================================================ */
function CartDrawer({ open, onClose, cart, updateQty, subtotal, onCheckout }) {
  return (
    <div className={`fixed inset-0 z-50 ${open ? "" : "pointer-events-none"}`}>
      <div onClick={onClose} className="absolute inset-0 transition-opacity" style={{ backgroundColor: C.ink, opacity: open ? 0.5 : 0 }} />
      <div className="absolute right-0 top-0 h-full w-full max-w-md flex flex-col transition-transform" style={{ backgroundColor: C.paper, transform: open ? "translateX(0)" : "translateX(100%)" }}>
        <GinghamStrip height={10} />
        <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: C.line }}>
          <div style={{ ...F_DISPLAY, color: C.ink }} className="text-xl">Warenkorb</div>
          <button onClick={onClose} className="w-9 h-9 rounded-lg flex items-center justify-center border-2" style={{ borderColor: C.ink }}>
            <X size={16} color={C.ink} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-5">
          {cart.length === 0 && (
            <div style={{ ...F_BODY, color: C.inkSoft }} className="text-sm text-center mt-12">Noch nichts im Warenkorb. Zeit für Pizza.</div>
          )}
          {cart.map((c) => (
            <div key={c.id} className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div style={{ ...F_BODY, color: C.ink, fontWeight: 600 }} className="text-sm truncate">{c.name}</div>
                <div style={{ ...F_MONO, color: C.tomato }} className="text-xs mt-0.5 font-bold">{fmt(c.price * c.qty)}</div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => updateQty(c.id, c.qty - 1)} className="w-7 h-7 rounded-md flex items-center justify-center border" style={{ borderColor: C.ink }}>
                  <Minus size={12} color={C.ink} />
                </button>
                <span style={{ ...F_MONO, color: C.ink }} className="text-sm w-4 text-center font-bold">{c.qty}</span>
                <button onClick={() => updateQty(c.id, c.qty + 1)} className="w-7 h-7 rounded-md flex items-center justify-center border" style={{ borderColor: C.ink }}>
                  <Plus size={12} color={C.ink} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {cart.length > 0 && (
          <div className="p-6 border-t" style={{ borderColor: C.line, backgroundColor: "white" }}>
            <div className="flex items-center justify-between mb-4">
              <span style={{ ...F_BODY, color: C.inkSoft }} className="text-sm">Zwischensumme</span>
              <span style={{ ...F_MONO, color: C.ink }} className="text-lg font-bold">{fmt(subtotal)}</span>
            </div>
            <button onClick={onCheckout} style={{ backgroundColor: C.tomato, ...F_BODY }} className="w-full py-4 rounded-lg text-sm font-bold text-white uppercase tracking-wide flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
              Zur Kasse <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ============================================================
   CHECKOUT MODAL
   ============================================================ */
/* Kartenzahlung vorübergehend deaktiviert (bis Steuernummer / Stripe live).
   Zum Reaktivieren: KARTE_AKTIV auf true setzen. */
const KARTE_AKTIV = false;

function CheckoutModal({ open, onClose, cart, subtotal, onConfirm }) {
  const [orderType, setOrderType] = useState("pickup");
  const [payment, setPayment] = useState("cash");
  const [form, setForm] = useState({ name: "", phone: "", email: "", address: "" });
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const deliveryFee = orderType === "delivery" ? 2.0 : 0;
  const discount = payment === "cash" ? subtotal * 0.1 : 0;
  const total = subtotal - discount + deliveryFee;

  if (!open) return null;

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const submit = async (e) => {
    e.preventDefault();
    setError("");

   if (payment === "cash") {
      setLoading(true);
      try {
        const res = await fetch("/.netlify/functions/send-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            kind: "order",
            cart, form, orderType, subtotal, discount, deliveryFee, total,
          }),
        });
        if (!res.ok) throw new Error();
        setDone(true);
      } catch {
        setError("Bestellung konnte nicht gesendet werden. Bitte ruf uns an: 02161 2954536");
      }
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/.netlify/functions/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cart, orderType, customer: form }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error || "Fehler");
      window.location.href = data.url;
    } catch (err) {
      setError("Zahlung konnte nicht gestartet werden. Bitte versuche es erneut oder ruf uns an: 02161 2954536");
      setLoading(false);
    }
  };
  const close = () => { setDone(false); onClose(); };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div onClick={close} className="absolute inset-0" style={{ backgroundColor: `${C.ink}CC` }} />
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl" style={{ backgroundColor: C.paper }}>
        <GinghamStrip height={10} />
        <div className="p-7">
          <button onClick={close} className="absolute top-6 right-5 w-9 h-9 rounded-lg flex items-center justify-center border-2" style={{ borderColor: C.ink, backgroundColor: C.paper }}>
            <X size={16} color={C.ink} />
          </button>

          {!done ? (
            <>
              <div style={{ ...F_DISPLAY, color: C.ink }} className="text-2xl mb-6">Bestellung abschließen</div>

              <div className="flex gap-3 mb-6">
                {[{ id: "pickup", label: "Abholung", icon: Store }, { id: "delivery", label: "Lieferung", icon: Truck }].map((o) => (
                  <button key={o.id} onClick={() => setOrderType(o.id)} style={{ backgroundColor: orderType === o.id ? "white" : "transparent", border: `2px solid ${orderType === o.id ? C.tomato : C.line}` }} className="flex-1 py-3 rounded-lg flex items-center justify-center gap-2">
                    <o.icon size={16} color={orderType === o.id ? C.tomato : C.inkSoft} />
                    <span style={{ ...F_BODY, color: orderType === o.id ? C.ink : C.inkSoft, fontWeight: 600 }} className="text-sm">{o.label}</span>
                  </button>
                ))}
              </div>

              <form onSubmit={submit} className="flex flex-col gap-4">
                <Field label="Name" value={form.name} onChange={set("name")} required />
                <Field label="Telefon" value={form.phone} onChange={set("phone")} type="tel" required />
                <Field label="E-Mail" value={form.email} onChange={set("email")} type="email" required />
                {orderType === "delivery" && <Field label="Lieferadresse" value={form.address} onChange={set("address")} required />}

                <div>
                  <label style={{ ...F_MONO, color: C.inkSoft, letterSpacing: "0.1em" }} className="text-xs uppercase block mb-2">Zahlungsart</label>
                  {!KARTE_AKTIV && (
                    <div style={{ ...F_BODY, color: C.inkSoft, backgroundColor: "#FDF1E7", border: `1px dashed ${C.crust}` }} className="text-xs p-3 rounded-lg mb-3 flex items-center gap-2">
                      <CreditCard size={14} color={C.crust} />
                      <span>Kartenzahlung folgt in Kürze — aktuell nur Barzahlung möglich.</span>
                    </div>
                  )}
                  <div className="flex flex-col gap-3">
                    <button type="button" onClick={() => setPayment("cash")} style={{ backgroundColor: payment === "cash" ? "#FDF1E7" : "white", border: `2px solid ${payment === "cash" ? C.tomato : C.line}` }} className="w-full p-4 rounded-lg flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Banknote size={18} color={C.tomato} />
                        <div className="text-left">
                          <div style={{ ...F_BODY, color: C.ink, fontWeight: 700 }} className="text-sm">Barzahlung</div>
                          <div style={{ ...F_MONO, color: C.tomato }} className="text-xs font-bold">-10 % Rabatt</div>
                        </div>
                      </div>
                      {payment === "cash" && <Check size={18} color={C.tomato} />}
                    </button>
                    {KARTE_AKTIV && (
                    <button type="button" onClick={() => setPayment("card")} style={{ backgroundColor: "white", border: `2px solid ${payment === "card" ? C.ink : C.line}` }} className="w-full p-4 rounded-lg flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CreditCard size={18} color={C.inkSoft} />
                        <div className="text-left">
                          <div style={{ ...F_BODY, color: C.ink, fontWeight: 700 }} className="text-sm">Kreditkarte / Online</div>
                          <div style={{ ...F_BODY, color: C.inkSoft }} className="text-xs">Kein Rabatt</div>
                        </div>
                      </div>
                      {payment === "card" && <Check size={18} color={C.ink} />}
                    </button>
                    )}
                  </div>
                </div>

                <div className="rounded-lg p-4 flex flex-col gap-2 mt-1" style={{ backgroundColor: "white", border: `1px solid ${C.line}` }}>
                  <div className="flex justify-between text-sm" style={{ ...F_BODY, color: C.inkSoft }}>
                    <span>Zwischensumme</span>
                    <span style={F_MONO}>{fmt(subtotal)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm" style={{ ...F_BODY, color: C.tomato, fontWeight: 600 }}>
                      <span>Bar-Rabatt (10 %)</span>
                      <span style={F_MONO}>-{fmt(discount)}</span>
                    </div>
                  )}
                  {deliveryFee > 0 && (
                    <div className="flex justify-between text-sm" style={{ ...F_BODY, color: C.inkSoft }}>
                      <span>Liefergebühr</span>
                      <span style={F_MONO}>{fmt(deliveryFee)}</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-2 border-t" style={{ borderColor: C.line }}>
                    <span style={{ ...F_BODY, color: C.ink, fontWeight: 700 }} className="text-base">Gesamt</span>
                    <span style={{ ...F_MONO, color: C.ink }} className="text-base font-bold">{fmt(total)}</span>
                  </div>
                </div>

                {error && (
                  <div style={{ ...F_BODY, backgroundColor: "#FDECEA", border: `1px solid ${C.tomato}`, color: C.tomatoDark }} className="text-xs p-3 rounded-lg">
                    {error}
                  </div>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  style={{ backgroundColor: C.tomato, ...F_BODY, opacity: loading ? 0.6 : 1 }}
                  className="w-full py-4 rounded-lg text-sm font-bold text-white uppercase tracking-wide mt-1 hover:opacity-90 transition-opacity"
                >
                  {loading ? "Wird geladen …" : payment === "cash" ? "Bestellung abschicken" : "Weiter zur Zahlung"}
                </button>
              </form>
            </>
          ) : (
            <div className="py-6 text-center flex flex-col items-center">
              <div className="w-14 h-14 rounded-full flex items-center justify-center mb-5" style={{ backgroundColor: "#E9F0E6", border: `2px solid ${C.basil}` }}>
                <Check size={26} color={C.basil} />
              </div>
              <div style={{ ...F_DISPLAY, color: C.ink }} className="text-2xl mb-2">Grazie, {form.name.split(" ")[0] || "mille"}!</div>
              <p style={{ ...F_BODY, color: C.inkSoft }} className="text-sm max-w-xs mb-6 leading-relaxed">
                Deine Bestellung ist eingegangen. {orderType === "delivery" ? "Wir liefern so schnell wie möglich." : "Du kannst sie in Kürze abholen."}
                {payment === "cash" ? " Bitte halte den Bar-Betrag bereit." : ""}
              </p>
              <div className="rounded-lg px-6 py-4 mb-6" style={{ backgroundColor: "white", border: `1px solid ${C.line}` }}>
                <span style={{ ...F_MONO, color: C.tomato }} className="text-2xl font-bold">{fmt(total)}</span>
              </div>
              <button onClick={() => { onConfirm(); close(); }} style={{ border: `2px solid ${C.ink}` }} className="px-6 py-3 rounded-lg text-sm">
                <span style={{ ...F_BODY, color: C.ink, fontWeight: 600 }}>Fertig</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, ...props }) {
  return (
    <div>
      <label style={{ ...F_MONO, color: C.inkSoft, letterSpacing: "0.1em" }} className="text-xs uppercase block mb-2">{label}</label>
      <input {...props} style={{ backgroundColor: "white", border: `1px solid ${C.line}`, color: C.ink, ...F_BODY }} className="w-full px-4 py-3 rounded-lg text-sm outline-none focus:border-2" />
    </div>
  );
}

/* ============================================================
   RESERVATION VIEW
   ============================================================ */
function ReservationView() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", date: "", time: "", guests: 2 });
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/.netlify/functions/send-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: "reservation", form }),
      });
      if (!res.ok) throw new Error();
      setDone(true);
    } catch {
      setError("Reservierung konnte nicht gesendet werden. Bitte ruf uns an: 02161 2954536");
    }
    setLoading(false);
  };

  return (
    <section style={{ backgroundColor: C.paper }} className="py-16">
      <div className="max-w-3xl mx-auto px-5 sm:px-8">
        <div className="text-center mb-10">
          <span style={{ ...F_MONO, color: C.basil, letterSpacing: "0.22em" }} className="text-xs uppercase">Reservierung</span>
          <h2 style={{ ...F_DISPLAY, color: C.ink }} className="text-3xl sm:text-4xl mt-2">Tisch Reservieren</h2>
          <p style={{ ...F_BODY, color: C.inkSoft }} className="mt-3 text-sm leading-relaxed max-w-md mx-auto">
            Sichere dir deinen Tisch bei Pizzeria Marinella. Wir bestätigen deine Reservierung telefonisch.
          </p>
        </div>

        {!done ? (
          <form onSubmit={submit} className="grid sm:grid-cols-2 gap-5 p-7 sm:p-9 rounded-2xl" style={{ backgroundColor: "white", border: `1px solid ${C.line}`, boxShadow: "0 10px 30px rgba(42,31,26,0.07)" }}>
            <Field label="Name" value={form.name} onChange={set("name")} required />
            <Field label="Telefon" value={form.phone} onChange={set("phone")} type="tel" required />
            <div className="sm:col-span-2">
              <Field label="E-Mail" value={form.email} onChange={set("email")} type="email" required />
            </div>
            <Field label="Datum" value={form.date} onChange={set("date")} type="date" required />
            <Field label="Uhrzeit" value={form.time} onChange={set("time")} type="time" required />
            <div className="sm:col-span-2">
              <label style={{ ...F_MONO, color: C.inkSoft, letterSpacing: "0.1em" }} className="text-xs uppercase block mb-2">Anzahl der Gäste</label>
              <div className="flex items-center gap-4">
                <button type="button" onClick={() => setForm({ ...form, guests: Math.max(1, form.guests - 1) })} className="w-10 h-10 rounded-lg flex items-center justify-center border-2" style={{ borderColor: C.ink }}>
                  <Minus size={14} color={C.ink} />
                </button>
                <div className="flex items-center gap-2">
                  <Users size={16} color={C.tomato} />
                  <span style={{ ...F_MONO, color: C.ink }} className="text-lg w-6 text-center font-bold">{form.guests}</span>
                </div>
                <button type="button" onClick={() => setForm({ ...form, guests: form.guests + 1 })} className="w-10 h-10 rounded-lg flex items-center justify-center border-2" style={{ borderColor: C.ink }}>
                  <Plus size={14} color={C.ink} />
                </button>
              </div>
            </div>

            {error && (
              <div className="sm:col-span-2" style={{ ...F_BODY, backgroundColor: "#FDECEA", border: `1px solid ${C.tomato}`, color: C.tomatoDark }}>
                <div className="text-xs p-3 rounded-lg">{error}</div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{ backgroundColor: C.tomato, ...F_BODY, opacity: loading ? 0.6 : 1 }}
              className="sm:col-span-2 py-4 rounded-lg text-sm font-bold text-white uppercase tracking-wide mt-1 hover:opacity-90 transition-opacity"
            >
              {loading ? "Wird gesendet …" : "Reservierung anfragen"}
            </button>
          </form>
        ) : (
          <div className="p-10 rounded-2xl text-center flex flex-col items-center" style={{ backgroundColor: "white", border: `1px solid ${C.line}` }}>
            <div className="w-14 h-14 rounded-full flex items-center justify-center mb-5" style={{ backgroundColor: "#E9F0E6", border: `2px solid ${C.basil}` }}>
              <Check size={26} color={C.basil} />
            </div>
            <div style={{ ...F_DISPLAY, color: C.ink }} className="text-2xl mb-2">Grazie, {form.name.split(" ")[0] || ""}!</div>
            <p style={{ ...F_BODY, color: C.inkSoft }} className="text-sm max-w-sm leading-relaxed">
              Deine Anfrage für {form.guests} {form.guests === 1 ? "Person" : "Personen"} am {form.date || "gewünschten Tag"} um {form.time || "gewünschte Uhrzeit"} ist eingegangen. Wir melden uns telefonisch unter {form.phone} zur Bestätigung.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

/* ============================================================
   MENU TEASER
   ============================================================ */
function MenuTeaser({ setView }) {
  const picks = MENU.filter((m) => ["14", "42", "163", "301"].includes(m.id));
  return (
    <section style={{ backgroundColor: C.paper }} className="py-20">
      <div className="max-w-5xl mx-auto px-5 sm:px-8">
        <div className="text-center mb-10">
          <span style={{ ...F_MONO, color: C.basil, letterSpacing: "0.22em" }} className="text-xs uppercase">Aus der Küche</span>
          <h2 style={{ ...F_DISPLAY, color: C.ink }} className="text-3xl sm:text-4xl mt-2">Beliebte Gerichte</h2>
        </div>
        <div className="rounded-2xl p-8 sm:p-10 max-w-2xl mx-auto" style={{ backgroundColor: "white", border: `1px solid ${C.line}`, boxShadow: "0 10px 30px rgba(42,31,26,0.07)" }}>
          <div className="flex flex-col gap-6">
            {picks.map((item) => (
              <div key={item.id}>
                <div className="flex items-baseline gap-2">
                  <span style={{ ...F_BODY, color: C.ink, fontWeight: 600 }} className="text-base shrink-0">{item.name}</span>
                  <span className="flex-1 border-b border-dotted translate-y-[-4px]" style={{ borderColor: C.inkSoft }} />
                  <span style={{ ...F_MONO, color: C.tomato, fontWeight: 700 }} className="text-sm shrink-0">{fmt(item.price)}</span>
                </div>
                {item.desc && <div style={{ ...F_BODY, color: C.inkSoft }} className="text-sm mt-1">{item.desc}</div>}
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <button onClick={() => setView("menu")} className="inline-flex items-center gap-2">
              <span style={{ ...F_BODY, color: C.tomato, fontWeight: 700 }} className="text-sm uppercase tracking-wide border-b-2">Ganze Speisekarte ansehen</span>
              <ChevronRight size={16} color={C.tomato} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   REVIEWS
   ============================================================ */
function ReviewsSection() {
  const reviews = [
    { name: "Sandra Pellen", text: "Wir haben bei Pizzeria Marinella nun schon einige Male bestellt. Trotz Sonderwünsche funktioniert immer alles top! Wir sind sehr zufrieden.", rating: 5 },
    { name: "Yuppie", text: "Auch die neuen Betreiber bieten gutes Essen, außerordentlich netten Service, gute Öffnungszeiten, faire Preise.", rating: 5 },
    { name: "Jessica Sandmann", text: "Super mit der falschen Lieferung umgegangen. Top Qualität und Top Essen.", rating: 5 },
  ];
  return (
    <section style={{ backgroundColor: C.linen }} className="py-20">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <span style={{ ...F_MONO, color: C.basil, letterSpacing: "0.22em" }} className="text-xs uppercase">Google Bewertungen</span>
            <h2 style={{ ...F_DISPLAY, color: C.ink }} className="text-3xl mt-2">Was Gäste sagen</h2>
          </div>
          <a href="https://maps.app.goo.gl/ME29rVt93uvtVuCZA" target="_blank" rel="noopener noreferrer" style={{ border: `2px solid ${C.ink}`, ...F_BODY, color: C.ink }} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold uppercase tracking-wide self-start">
            Alle Bewertungen ansehen
          </a>
        </div>
        <div className="grid sm:grid-cols-3 gap-6">
          {reviews.map((r, i) => (
            <div key={i} className="p-6 rounded-2xl flex flex-col" style={{ backgroundColor: "white", border: `1px solid ${C.line}` }}>
              <div className="flex gap-1 mb-3">
                {Array.from({ length: r.rating }).map((_, j) => (
                  <Star key={j} size={14} color={C.crust} fill={C.crust} />
                ))}
              </div>
              <p style={{ ...F_BODY, color: C.inkSoft }} className="text-sm leading-relaxed mb-4 flex-1">"{r.text}"</p>
              <span style={{ ...F_BODY, color: C.ink, fontWeight: 700 }} className="text-sm">{r.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   GALERIE
   ============================================================ */
function GalerieSection() {
  const images = [
    { src: "/dish1.png", alt: "Steinofen-Pizza mit frischen Zutaten" },
    { src: "/dish2.png", alt: "Handgemachter Burger mit Pommes" },
    { src: "/dish3.png", alt: "Pasta al Forno" },
    { src: "/dish4.png", alt: "Frischer gemischter Salat" },
    { src: "/dish5.png", alt: "Hausgemachtes Tiramisu" },
    { src: "/dish6.png", alt: "Pizza frisch aus dem Steinofen" },
  ];
  return (
    <section style={{ backgroundColor: C.paper }} className="py-20">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="text-center mb-10">
          <span style={{ ...F_MONO, color: C.basil, letterSpacing: "0.22em" }} className="text-xs uppercase">Galerie</span>
          <h2 style={{ ...F_DISPLAY, color: C.ink }} className="text-3xl sm:text-4xl mt-2">Direkt aus dem Ofen</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          {images.map((img, i) => (
            <div key={i} className="relative overflow-hidden rounded-2xl group" style={{ border: `1px solid ${C.line}`, aspectRatio: "4 / 3" }}>
              <img src={img.src} alt={img.alt} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   CTA BANNER
   ============================================================ */
function CtaBanner({ setView }) {
  return (
    <section className="relative py-24 text-center overflow-hidden bg-cover bg-center" style={{ backgroundImage: `linear-gradient(rgba(158, 42, 24, 0.51), rgba(199, 53, 31, 0.51)), url('/cta.jpg')` }}>
      <div className="max-w-2xl mx-auto px-5 relative">
        <h2 style={{ ...F_DISPLAY, color: "white" }} className="text-3xl sm:text-4xl mb-4 leading-tight">Hunger auf echtes Steinofen-Feuer?</h2>
        <p style={{ ...F_BODY, color: "#FBE6DD" }} className="mb-9 text-base">Bestell jetzt online oder reservier deinen Tisch — bar zahlen und 10 % sparen.</p>
        <div className="flex flex-wrap justify-center gap-4">
          <button onClick={() => setView("menu")} style={{ backgroundColor: C.paper, ...F_BODY, color: C.tomato }} className="px-7 py-4 rounded-lg text-sm font-bold uppercase tracking-wide hover:opacity-90 transition-opacity">Online Bestellen</button>
          <button onClick={() => setView("reservation")} style={{ border: `2px solid white`, ...F_BODY, color: "white" }} className="px-7 py-4 rounded-lg text-sm font-bold uppercase tracking-wide">Tisch Reservieren</button>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   LEGAL PAGES
   ============================================================ */
function LegalPage({ title, children }) {
  return (
    <section style={{ backgroundColor: C.paper }} className="py-16">
      <div className="max-w-3xl mx-auto px-5 sm:px-8">
        <h2 style={{ ...F_DISPLAY, color: C.ink }} className="text-3xl sm:text-4xl mb-10">{title}</h2>
        <div style={{ ...F_BODY, color: C.inkSoft }} className="text-sm leading-relaxed flex flex-col gap-6">{children}</div>
      </div>
    </section>
  );
}

function LegalBlock({ heading, children }) {
  return (
    <div>
      <h3 style={{ ...F_BODY, color: C.ink, fontWeight: 700 }} className="text-base mb-2">{heading}</h3>
      {children}
    </div>
  );
}

function ImpressumView() {
  return (
    <LegalPage title="Impressum">
      <LegalBlock heading="Angaben gemäß § 5 TMG">
        <p>Pizzeria Marinella<br />Inhaber: Rami Fahmi Hermiz<br />Rochusstraße 2–4<br />41352 Korschenbroich</p>
      </LegalBlock>
      <LegalBlock heading="Kontakt">
        <p>Telefon: 02161 2954536<br />E-Mail:  info@pizzeria-marinella.de</p>
      </LegalBlock>
      <LegalBlock heading="Umsatzsteuer-ID">
        <p>Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:<br />[USt-IdNr. HIER — oder Steuernummer]</p>
      </LegalBlock>
      <LegalBlock heading="Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV">
        <p>Rami Fahmi Hermiz<br />Rochusstraße 2–4, 41352 Korschenbroich</p>
      </LegalBlock>
      <LegalBlock heading="EU-Streitschlichtung">
        <p>Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer" style={{ color: C.tomato }} className="underline">https://ec.europa.eu/consumers/odr/</a></p>
      </LegalBlock>
      <LegalBlock heading="Verbraucherstreitbeilegung">
        <p>Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.</p>
      </LegalBlock>
    </LegalPage>
  );
}

function DatenschutzView() {
  return (
    <LegalPage title="Datenschutzerklärung">
      <LegalBlock heading="1. Datenschutz auf einen Blick">
        <p>Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können.</p>
      </LegalBlock>
      <LegalBlock heading="2. Verantwortliche Stelle">
        <p>Pizzeria Marinella<br />Inhaber: Rami Fahmi Hermiz<br />Rochusstraße 2–4, 41352 Korschenbroich<br />Telefon: 02161 2954536<br />E-Mail:  info@pizzeria-marinella.de</p>
      </LegalBlock>
      <LegalBlock heading="3. Datenerfassung auf dieser Website">
        <p>Der Provider der Seiten erhebt und speichert automatisch Informationen in Server-Log-Dateien, die Ihr Browser übermittelt (Browsertyp, Betriebssystem, Referrer-URL, Uhrzeit der Anfrage, IP-Adresse). Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO.</p>
      </LegalBlock>
      <LegalBlock heading="4. Bestell- und Reservierungsformulare">
        <p>Wenn Sie über unsere Website bestellen oder einen Tisch reservieren, verarbeiten wir die angegebenen Daten (Name, Telefonnummer, E-Mail, ggf. Lieferadresse, Bestell- bzw. Reservierungsdetails) ausschließlich zur Abwicklung. Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO. Die Daten werden nach Abwicklung gelöscht, sofern keine gesetzlichen Aufbewahrungspflichten bestehen.</p>
      </LegalBlock>
      <LegalBlock heading="5. Externe Dienste">
        <p>Diese Website nutzt Google Fonts. Beim Aufruf lädt Ihr Browser Schriften von Google-Servern; dabei wird Ihre IP-Adresse an Google übertragen. Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO. Weitere Infos: <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: C.tomato }} className="underline">policies.google.com/privacy</a></p>
        <p className="mt-3">[Falls EmailJS / Stripe / Google Maps eingebaut werden: jeweils einen Absatz ergänzen.]</p>
      </LegalBlock>
      <LegalBlock heading="6. Ihre Rechte">
        <p>Sie haben jederzeit das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit sowie Widerspruch (Art. 15–21 DSGVO). Zuständige Aufsichtsbehörde: Landesbeauftragte für Datenschutz und Informationsfreiheit Nordrhein-Westfalen.</p>
      </LegalBlock>
    </LegalPage>
  );
}

/* ============================================================
   FOOTER
   ============================================================ */
function Footer({ setView }) {
  return (
    <footer style={{ backgroundColor: C.linen }}>
      <GinghamStrip height={10} />
      <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-14 pb-8">
        <div className="grid sm:grid-cols-3 gap-10 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src="/logo.png" alt="Pizzeria Marinella Logo" className="w-11 h-11 object-contain" />
              <span style={{ ...F_DISPLAY, color: C.tomato }} className="text-lg">Marinella</span>
            </div>
            <p style={{ ...F_BODY, color: C.inkSoft }} className="text-sm leading-relaxed max-w-xs">Original italienische Küche aus dem Steinofen — mitten in Korschenbroich.</p>
          </div>
          <div>
            <div style={{ ...F_MONO, color: C.basil, letterSpacing: "0.18em" }} className="text-xs uppercase mb-4">Kontakt</div>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <MapPin size={16} color={C.tomato} className="shrink-0" />
                <span style={{ ...F_BODY, color: C.inkSoft }} className="text-sm">Rochusstraße 2–4, 41352 Korschenbroich</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={16} color={C.tomato} className="shrink-0" />
                <span style={{ ...F_BODY, color: C.inkSoft }} className="text-sm">021612954536</span>
              </div>
            </div>
          </div>
          <div>
            <div style={{ ...F_MONO, color: C.basil, letterSpacing: "0.18em" }} className="text-xs uppercase mb-4">Öffnungszeiten</div>
            <div className="flex flex-col gap-2" style={{ ...F_BODY, color: C.inkSoft }}>
              <div className="flex items-center gap-3 text-sm"><Clock size={16} color={C.tomato} className="shrink-0" /><span>Mo–Fr: 11:00 - 14:00 Uhr 17:00 – 22:00 Uhr</span></div>
              <div className="flex items-center gap-3 text-sm pl-7"><span>Sa–So: 14:00 – 22:00 Uhr</span></div>
            </div>
          </div>
        </div>
        <div className="pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-3" style={{ borderColor: C.line }}>
          <span style={{ ...F_BODY, color: C.inkSoft }} className="text-xs">© {new Date().getFullYear()} Pizzeria Marinella. Alle Rechte vorbehalten.</span>
          <div className="flex items-center gap-4">
            <button onClick={() => setView("impressum")} style={{ ...F_BODY, color: C.inkSoft }} className="text-xs hover:underline">Impressum</button>
            <button onClick={() => setView("datenschutz")} style={{ ...F_BODY, color: C.inkSoft }} className="text-xs hover:underline">Datenschutz</button>
            <a href="https://ouceal.de/" target="_blank" rel="noopener noreferrer" style={{ ...F_BODY, color: C.inkSoft }} className="text-xs hover:underline">Designed by <span style={{ color: C.tomato }}>Ouceal</span></a>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ============================================================
   APP
   ============================================================ */
export default function PizzeriaMarinella() {
  const [view, setView] = useState("home");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, [view]);

  const [payStatus, setPayStatus] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("bezahlt") === "1") {
      setPayStatus("success");
      setCart([]);
      window.history.replaceState({}, "", "/");
    } else if (params.get("abgebrochen") === "1") {
      setPayStatus("cancelled");
      window.history.replaceState({}, "", "/");
    }
  }, []);

  useEffect(() => {
    document.body.style.overflow = (cartOpen || checkoutOpen) ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [cartOpen, checkoutOpen]);

  const addToCart = (item) => {
    setCart((prev) => {
      const found = prev.find((c) => c.id === item.id);
      if (found) return prev.map((c) => (c.id === item.id ? { ...c, qty: c.qty + 1 } : c));
      return [...prev, { ...item, qty: 1 }];
    });
    setCartOpen(true);
  };

  const updateQty = (id, qty) => {
    setCart((prev) => {
      if (qty <= 0) return prev.filter((c) => c.id !== id);
      return prev.map((c) => (c.id === id ? { ...c, qty } : c));
    });
  };

  const subtotal = useMemo(() => cart.reduce((s, c) => s + c.price * c.qty, 0), [cart]);
  const cartCount = useMemo(() => cart.reduce((s, c) => s + c.qty, 0), [cart]);

  return (
    <div style={{ backgroundColor: C.paper, minHeight: "100vh" }} className="w-full">
      <style>{FONTS}</style>

      <Navbar view={view} setView={setView} cartCount={cartCount} onCartClick={() => setCartOpen(true)} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

        {payStatus && (
        <div
          style={{
            backgroundColor: payStatus === "success" ? "#E9F0E6" : "#FDECEA",
            borderBottom: `2px solid ${payStatus === "success" ? C.basil : C.tomato}`,
          }}
          className="px-5 py-4"
        >
          <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {payStatus === "success" ? <Check size={20} color={C.basil} /> : <X size={20} color={C.tomato} />}
              <span style={{ ...F_BODY, color: C.ink, fontWeight: 600 }} className="text-sm">
                {payStatus === "success"
                  ? "Zahlung erfolgreich! Deine Bestellung ist eingegangen — wir legen los. Grazie!"
                  : "Zahlung abgebrochen. Dein Warenkorb ist noch da."}
              </span>
            </div>
            <button onClick={() => setPayStatus(null)} className="shrink-0">
              <X size={16} color={C.inkSoft} />
            </button>
          </div>
        </div>
      )}

      {view === "home" && (
        <>
          <Hero setView={setView} />
          <AboutStrip />
          <MenuTeaser setView={setView} />
          <ReviewsSection />
          <GalerieSection />
          <CtaBanner setView={setView} />
        </>
      )}
      {view === "menu" && <MenuView cart={cart} addToCart={addToCart} />}
      {view === "reservation" && <ReservationView />}
      {view === "impressum" && <ImpressumView />}
      {view === "datenschutz" && <DatenschutzView />}

      <Footer setView={setView} />

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} cart={cart} updateQty={updateQty} subtotal={subtotal} onCheckout={() => { setCartOpen(false); setCheckoutOpen(true); }} />

      <CheckoutModal open={checkoutOpen} onClose={() => setCheckoutOpen(false)} cart={cart} subtotal={subtotal} onConfirm={() => setCart([])} />
    </div>
  );
}