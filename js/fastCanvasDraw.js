window.fastCanvasDraw = (canvasId, canvasJSON) => {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext('2d');

    let canvasObject = JSON.parse(canvasJSON);
    console.log(canvasObject);

    for (let i = 0; i < canvasObject.length; i++) {
        let x = canvasObject[i];
        switch (x.type) {
            case "fillRect": ctx.fillRect(x.n[0], x.n[1], x.n[2], x.n[3]); break;
            case "strokeRect": ctx.strokeRect(x.n[0], x.n[1], x.n[2], x.n[3]); break;
            case "clearRect": ctx.clearRect(x.n[0], x.n[1], x.n[2], x.n[3]); break;

            case "beginPath": ctx.beginPath(); break;
            case "closePath": ctx.closePath(); break;
            case "moveTo": ctx.moveTo(x.n[0], x.n[1]); break;
            case "lineTo": ctx.lineTo(x.n[0], x.n[1]); break;
            case "fill": ctx.fill(); break;
            case "rect": ctx.rect(x.n[0], x.n[1], x.n[2], x.n[3]); break;
            case "stroke": ctx.stroke(); break;
            case "bezierCurveTo": ctx.bezierCurveTo(x.n[0], x.n[1], x.n[2], x.n[3], x.n[4], x.n[5]); break;
            case "arc":
                if (x.s[0] === "true") {
                    ctx.arc(x.n[0], x.n[1], x.n[2], x.n[3], x.n[4], true);
                } else {
                    ctx.arc(x.n[0], x.n[1], x.n[2], x.n[3], x.n[4]);
                }
                break;
            case "arcTo": ctx.arcTo(x.n[0], x.n[1], x.n[2], x.n[3], x.n[4]); break;
            case "quadraticCurveTo": ctx.quadraticCurveTo(x.n[0], x.n[1], x.n[2], x.n[3]); break;

            case "direction": ctx.direction = x.s[0].toLowerCase(); break;
            case "fillText":
                if (x.n[2] === -1) {
                    ctx.fillText(x.s[0], x.n[0], x.n[1]);
                } else {
                    ctx.fillText(x.s[0], x.n[0], x.n[1], x.n[2]);
                }
                break;
            case "font": ctx.font = x.s[0]; break;
            case "measureText": console.log(ctx.measureText(x.s[0].width)); break;
            case "strokeText":
                if (x.n[2] === -1) {
                    ctx.strokeText(x.s[0], x.n[0], x.n[1]);
                } else {
                    ctx.strokeText(x.s[0], x.n[0], x.n[1], x.n[2]);
                }
                break;
            case "textAlign": ctx.textAlign = x.s[0].toLowerCase(); break;
            case "textBaseline": ctx.textBaseline = x.s[0].toLowerCase(); break;

            case "addColorStop": console.error("Please put a Gradient before this call.");
            case "createLinearGradient":
                let g1 = ctx.createLinearGradient(x.n[0], x.n[1], x.n[2], x.n[3]);
                i++;
                while (i < canvasObject.length && canvasObject[i].type === "addColorStop") {
                    g1.addColorStop(canvasObject[i].n[0].toString(), canvasObject[i].s[0]);
                    i++;
                }
                if (canvasObject[i].type === "strokeStyle") {
                    ctx.strokeStyle = g1; 
                } else if (canvasObject[i].type === "fillStyle") {
                    ctx.fillStyle = g1;
                } else {
                    console.error("Please end the gradient by assigning either Stroke or Fill style.");
                }
                break;
            case "createPattern":
                let img = document.getElementById(x.s[0]);
                const pattern = ctx.createPattern(img, x.s[1].toLowerCase());
                ctx.fillStyle = pattern;
                break;
            case "createRadialGradient":
                let g2 = ctx.createRadialGradient(x.n[0], x.n[1], x.n[2], x.n[3], x.n[4], x.n[5]);
                i++;
                while (i < canvasObject.length && canvasObject[i].type === "addColorStop") {
                    g2.addColorStop(canvasObject[i].n[0].toString(), canvasObject[i].s[0]);
                    i++;
                }
                if (canvasObject[i].type === "strokeStyle") {
                    ctx.strokeStyle = g2;
                } else if (canvasObject[i].type === "fillStyle") {
                    ctx.fillStyle = g2;
                } else {
                    console.error("Please end the gradient by assigning either Stroke or Fill style.");
                }
                break;
            case "fillStyle": ctx.fillStyle = x.s[0]; break;
            case "lineCap": ctx.lineCap = x.s[0].toLowerCase(); break;
            case "lineJoin": ctx.lineJoin = x.s[0].toLowerCase(); break;
            case "lineWidth": ctx.lineWidth = x.n[0]; break;
            case "miterLimit": ctx.miterLimit = x.n[0]; break;
            case "shadowBlur": ctx.shadowBlur = x.n[0]; break;
            case "shadowColor": ctx.shadowColor = x.s[0]; break;
            case "shadowOffsetX": ctx.shadowOffsetX = x.n[0]; break;
            case "shadowOffsetY": ctx.shadowOffsetY = x.n[0]; break;
            case "strokeStyle": ctx.strokeStyle = x.s[0]; break;

            case "scale": ctx.scale(x.n[0], x.n[1]); break;
            case "rotate": ctx.rotate(x.n[0]); break;
            case "translate": ctx.translate(x.n[0], x.n[1]); break;
            case "transform": ctx.transform(x.n[0], x.n[1], x.n[2], x.n[3], x.n[4], x.n[5]); break;
            case "setTransform": ctx.setTransform(x.n[0], x.n[1], x.n[2], x.n[3], x.n[4], x.n[5]); break;

            default: console.error("Case not found.");

        }
    }
}