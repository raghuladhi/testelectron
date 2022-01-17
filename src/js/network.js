const ping = require("ping");

const hosts = [{
    ip: '172.20.23.84',
    name: "App server - writer",
}, {
    ip: '172.20.15.246',
    name: "Conversion - writer",
}, {
    ip: '172.20.57.182',
    name: "PDF Server - writer",
}, {
    ip: '172.20.38.31',
    name: "POI Aspose - writer",
}, {
    ip: '172.20.26.185',
    name: "writerz",
}, {
    ip: '172.20.5.135',
    name: "padlocal",
}, {
    ip: '172.20.5.55',
    name: "writer3redis",
}, {
    ip: '172.20.19.175',
    name: "writer2",
}, {
    ip: '172.20.10.31',
    name: "writerinteg",
}, {
    ip: '172.20.23.239',
    name: "writerm",
}, {
    ip: '172.20.15.15',
    name: "proofing",
}, {
    ip: '172.20.36.118',
    name: "writerdemo",
}, {
    ip: '172.20.25.171',
    name: "writercminteg",
}, {
    ip: '172.20.41.68',
    name: "writerct",
}, {
    ip: '172.20.54.44',
    name: "Conversion - writerct",
}, {
    ip: '172.20.39.147',
    name: "bluepencil",
}, {
    ip: '172.20.41.202',
    name: "writerinteg1",
}, {
    ip: '172.20.46.157',
    name: "writerinteg2",
}, {
    ip: '172.20.41.235',
    name: "writerinteg3",
}, {
    ip: '172.20.46.234',
    name: "writerinteg4",
}, {
    ip: '172.20.46.116',
    name: "writerinteg5",
}, {
    ip: '172.20.43.34',
    name: "writerpdf",
}, {
    ip: '172.20.56.250',
    name: "writerpdffiller",
}, {
    ip: '172.20.58.4',
    name: "writerinsights",
}, {
    ip: '172.20.51.97',
    name: "writersp",
}, {
    ip: '172.20.60.94',
    name: "writerqa1",
}, {
    ip: '172.20.60.95',
    name: "writerqa2",
},

];

const refreshBtn = document.getElementById("refresh");
let content = document.getElementById("content-container");

function getStatusSpan(status) {
    let statusSpan = '<b>Status : </b>';
    if(status == undefined) {
        statusSpan += '<span>...</span>';
    } else if (status) {
        statusSpan += '<span class="active">Active</span>';
    } else {
        statusSpan += '<span class="inactive">Unable to Reach</span>';
    }
    return statusSpan;

}
function createMachineFragment(obj) {
    let status = getStatusSpan(obj.status);
    let htmlStr = '<div class="content"><p><b>Machine</b> : '+obj.name+'</p><p><b>Machine IP</b> : '+
    obj.ip+'</p><p>'+status+'</p></div>';
    let template = document.createElement("template");
    template.innerHTML = htmlStr;
    return template;
    
}

function setStatus() {
    hosts.forEach(function (host) {
        let template = createMachineFragment(host);
        content.appendChild(template.content);
        let addedContent = content.children[content.children.length-1];
        ping.promise.probe(host.ip)
            .then(function (res) {
                let statusSpan = getStatusSpan(res.alive);
                addedContent.children[2].innerHTML = statusSpan;
            });
    });
}


refreshBtn.addEventListener("click", () => {
    content.innerHTML = "";
    setStatus();
})

setStatus();