var contrat = {
    ouvertureContrat : function() {
            width = 1000;
            height = 800;
            
            var top = (screen.height - height)/2;
            var left = (screen.width - width)/2;

            window.open('contrat.html','contrat_de_location','menubar=no, scrollbars=no, top='+top+', left='+left+', width='+width+', height='+height+'');
    },

    affichageSignature : function() {
        document.getElementById("imgSignature").setAttribute("src", localStorage.getItem("signature"));
    }
}