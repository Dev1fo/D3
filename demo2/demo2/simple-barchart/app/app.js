import conf from './conf.js';
import SimpleBarChart from './SimpleBarChart.js';


document.getElementById("valider").addEventListener("click", function (event) {

   let width = document.getElementById("width").value;
   let height = document.getElementById("height").value;
   let startCol = document.getElementById("startCol").value;
   let endCol = document.getElementById("endCol").value;
   let data = document.getElementById("data").value;
   let url = document.getElementById("url").value;

   if(data<2){
      url="localUrl"
   }

   if (width == "" || height == "") {
      alert("Veuillez saisir la hauteur et la largeur svp");

   } else if (width < 700 || height < 700 || width > 2000 || height > 2000) {
      alert("Veuillez entrer une largeur et une hauteur supérieure à 700px et inférieure à 2000px svp");
   } else if (url == "") {
      alert("Veuillez saisir une adresse Url valide svp");
   } else {
      const barChart = new SimpleBarChart('svg1', "Evolution du marché par pays", "Quantité de production par an", conf);

      if (data == 0) {
         barChart.resizeChart(width, height);
         barChart.updateColor(startCol, endCol);
         barChart.drawChartJs();

      } else if (data == 1) {

         barChart.resizeChart(width, height);
         barChart.updateColor(startCol, endCol);
         barChart.drawChartJson();
      } else {
         barChart.resizeChart(width, height);
         barChart.updateColor(startCol, endCol);
         barChart.drawChartUrl(url);
        
      }

   }
   event.preventDefault();
}, false);