/* 
===========================
##### APPEARANCE CODE ##### 
===========================
*/

function window_sizer() {

    var page_width = document.body.offsetWidth ? document.body.offsetWidth : document.width;
    //var page_height = document.body.offsetHeight ? document.body.offsetHeight : document.height;
    //var page_height = document.getElementById("bodyid").offsetheight;
    var page_height = window.innerHeight;
    var rightsize = page_width - 250 - 80;
    var heightsize = page_height - 100;


    if (rightsize < 500) {
        rightsize = 500
    }

    
    if (heightsize < 300) {
        heightsize = 300;
    }

    document.getElementById("right_side").style.width = rightsize.toString() + "px";
    document.getElementById("right_side").style.height = heightsize.toString() + "px";
    document.getElementById("left_side").style.height = heightsize.toString() + "px";
    //document.getElementById("bodyid").style.height = heightsize.toString() + "px";
}

window.onload = function () {

    /* 
    =====================
    ##### INIT CODE ##### 
    =====================
    */

    var database = [];
    var filtered_database = [];
    var filtered_id = [];
    var MERGE_OPEN = "open";

    //document.getElementById("radio_search_name").checked = true;
    window_sizer();

    /* 
    =====================
    ##### MENU CODE ##### 
    =====================
    */

    var menu_save = document.getElementById("menu_save");
    var menu_open = document.getElementById("menu_open");
    var menu_new = document.getElementById("menu_new");

    var menu_add_record = document.getElementById("menu_add_record");
    var menu_edit_record = document.getElementById("menu_edit_record");
    var menu_delete_record = document.getElementById("menu_delete_record");

    //var menu_merge_json = document.getElementById("menu_merge_json");

    if (menu_save) { menu_save.addEventListener("click", save_download); }
    if (menu_open) { menu_open.addEventListener("click", open_dialog); }
    if (menu_new) { menu_new.addEventListener("click", new_data); }
    
    if (menu_add_record) { menu_add_record.addEventListener("click", add_record); }
    if (menu_edit_record) { menu_edit_record.addEventListener("click", edit_record); }
    if (menu_delete_record) { menu_delete_record.addEventListener("click", delete_record); }
    
    //if (menu_merge_json) { menu_merge_json.addEventListener("click", merge_json); }

    /* 
    =======================
    ##### WIDGET CODE ##### 
    =======================
    */
    
    var TEXT_OUTPUT = document.getElementById("text_output");
    if (TEXT_OUTPUT) { TEXT_OUTPUT.addEventListener("input", save_text_changes); }

    var INPUT_SEARCH = document.getElementById("input_search");
    if (INPUT_SEARCH) { INPUT_SEARCH.addEventListener("input", filter_database); }

    var SUBJECT_LIST = document.getElementById("subject_list");
    //if (SUBJECT_LIST) { SUBJECT_LIST.addEventListener("input", load_text)}
    if (SUBJECT_LIST) { SUBJECT_LIST.addEventListener("change", load_text); }

    var RADIO_SEARCH_NAME = document.getElementById("radio_search_name");
    //var RADIO_SEARCH_CONTENTS = document.getElementById("radio_search_contents");

    var BUTTON_CLEAR = document.getElementById("button_clear");
    if (BUTTON_CLEAR) { BUTTON_CLEAR.addEventListener("click", clear_search); }

    /* 
    =========================
    ##### DATABASE CODE ##### 
    =========================
    */

    function new_data() {
        if (window.confirm("All record data will be lost!")) {
            database = [];
            filter_database();
        }
    }

    function add_record() {

        var new_record_name = window.prompt("Name the new record:","");
 
        if (new_record_name != null && new_record_name != "") {

            if (check_duplicate(new_record_name) == true) {
                alert("A record with this name already exists.");
            }

            else {

                let rdata = [new_record_name, ""];
                database[database.length] = rdata;

                filter_database();
                //load_text();
            }
        }
    }

    function edit_record() {
        var new_record_name = window.prompt("Name the new record:","");
 
        if (new_record_name != null && new_record_name != "") {

            if (check_duplicate(new_record_name) == true) {
                alert("A record with this name already exists.");
            }

            else { 
                database[filtered_id[SUBJECT_LIST.selectedIndex]][0] = new_record_name;

                filter_database();
                //load_text();
            }
        }
    }

    function delete_record() {

        if (database.length > 0) {
            if (window.confirm("Are you sure you want to delete the selected record?")) {
                database.splice(filtered_id[SUBJECT_LIST.selectedIndex], 1);
                filter_database();

                /*if (database.length > 0) {
                    load_text();
                }

                else {
                    TEXT_OUTPUT.value = "";
                }*/
            }
        }
    }

    function check_duplicate(new_record_name) {
        for (let i = 0; i < database.length; i++) {
            if (database[i][0] == new_record_name) {
                return true
            }
        }

        return false
    }

    function filter_database() {
        filtered_database = [];
        filtered_id = [];

        sort_database();

        for (let i = 0; i < database.length; i++) {

			if (database[i][0].toLowerCase().includes(INPUT_SEARCH.value.toLowerCase())) {
				filtered_database.push(database[i]);
				filtered_id.push(i);
			}
		
			else if (database[i][1].toLowerCase().includes(INPUT_SEARCH.value.toLowerCase())) {
				filtered_database.push(database[i]);
				filtered_id.push(i);
			}   
        }

        display_data();
        load_text();
    }

    function sort_database() {
        
        if (database.length > 0) {
            var sorted = [];
            var sorter = database;
            var highest = "";
            var highest_id = 0
            var finished = false;

            while (finished == false) {
                if (sorter.length == 1) {
                    sorted.push(sorter[0]);
                    finished = true;
                }

                else {
                    highest = sorter[0][0].toLowerCase();
                    for (let i = 0; i < sorter.length; i++) {
                        if (sorter[i][0].toLowerCase() <= highest) {
                            highest = sorter[i][0].toLowerCase();
                            highest_id = i;
                        }
                    }
                    sorted.push(sorter[highest_id]);
                    sorter.splice(highest_id, 1);
                }
            }
            database = sorted;
        }
    }

    function save_text_changes() {
        if (database.length > 0) {
            database[filtered_id[SUBJECT_LIST.selectedIndex]][1] = TEXT_OUTPUT.value
        }

        else {
            TEXT_OUTPUT.value = "";
        }       
    }

    /* 
    =======================
    ##### OUTPUT CODE ##### 
    =======================
    */

    function load_text() {
        if (filtered_database.length > 0) {
            TEXT_OUTPUT.value = database[filtered_id[SUBJECT_LIST.selectedIndex]][1];
        }
        else {
            TEXT_OUTPUT.value = "";
        }
    }

    function display_data() {
        let options = SUBJECT_LIST.getElementsByTagName('option');

        for (var i=options.length; i--;) {
            SUBJECT_LIST.removeChild(options[i]);
        }

        for (let i = 0; i < filtered_database.length; i++) {
            var opt = document.createElement('option');
            opt.value = opt.innerHTML = filtered_database[i][0];
            opt.innerHTML = filtered_database[i][0];
            SUBJECT_LIST.appendChild(opt);
        }
        SUBJECT_LIST.selectedIndex = 0;
    }

    function clear_search() {
        INPUT_SEARCH.value = "";
        filter_database();
    }

    /* 
    =====================
    ##### FILE CODE ##### 
    =====================
    */

    var fileSelector = document.createElement('input');
    fileSelector.setAttribute('type', 'file');
    if (fileSelector) { fileSelector.addEventListener("change", verify_file); }
  
    function open_dialog() {
        MERGE_OPEN = "open";
        fileSelector.value = ""
        fileSelector.click();
    }

    function verify_file() {
        if (fileSelector.value != "") {
            let reader = new FileReader();
            reader.readAsText(fileSelector.files[0]);
            reader.onload = function(e) {
                if (MERGE_OPEN == "open") {
                    database = JSON.parse(reader.result);
                    filter_database();
                }
                if (MERGE_OPEN == "merge" && database != "") {
                    merge_data = JSON.parse(reader.result);
                    database = database.concat(merge_data);
                    filter_database();
                }
            }        
        }
    }

    function merge_json() {
        //MERGE_OPEN = "merge";
        fileSelector.value = "";
        fileSelector.click();

    }
    
    function save_download() {

        let currentdate = new Date();
        let cday = currentdate.getDate();
        let cmonth = currentdate.getMonth() + 1;
        let cyear = currentdate.getFullYear();
        let ctime = currentdate.getHours() + "_" + currentdate.getMinutes() + "_" + currentdate.getSeconds();
        let cfilename = cmonth + "_" + cday + "_" + cyear + "_" + ctime;


        var jsondata = JSON.stringify(database)

        var c = document.createElement("a");
        c.download = cfilename + ".json";

        var t = new Blob([jsondata], {
            type: "text/plain"
        });
        
        c.href = window.URL.createObjectURL(t);
        c.click();

    }

    /* 
    ======================
    ##### TIMER CODE ##### 
    ======================
    */

    function start_timer(){

        timer_duration = 0;
        if (database.length > 0) {
            update_database(); 

            /*var timer = setInterval(function(){
                timer_duration = timer_duration + 1;
                
                if (timer_duration >= 2) {
                    console.log(timer_duration);
                    timer_duration = 0;
                    console.log(timer);
                    clearInterval(timer);
                    update_database();  
                }

            }, 500);*/
        }

        else {
            document.getElementById('textoutput').value = ""
        }
    }
}