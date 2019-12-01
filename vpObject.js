var idCounter = 0;
class VPObject {
    constructor({
        drawable = true,
        mouseListening = false,
        zOrder = 0
    } = {}) {
        this.uuid = idCounter++;
        this.zOrder = zOrder;
        this.mouseListening = mouseListening;
        this.drawable = drawable;
        this.position = new NPoint(0, 0);
        this.mouseOverlapping = false;
        this.held = false;
        this.grabbed = false;
        this.size = 10;
    }

    static globalInit(vp){
        
    }

    isMouseBlockingOverlap(vp) {
        return false;
    }

    isMouseBlockingPress(vp) {
        return false;
    }

    isOverlapping(point) {
        return this.position.subtractp(point).lengthSquared() < Math.pow(this.size, 2);
    }

    draw(vp, ctx) {
        ctx.fillStyle = "black";
        this.fillCircle(vp);
    }

    strokeLine(vp, ctx, posA, posB) {
        posA = vp.canvasToViewSpace(posA);
        posB = vp.canvasToViewSpace(posB);
        ctx.beginPath();
        ctx.moveTo(posA.x, posA.y);
        ctx.lineTo(posB.x, posB.y);
        ctx.stroke();
    }

    fillCircle(vp, ctx) {
        const self = this;
        const adPos = vp.canvasToViewSpace(self.position);
        ctx.beginPath();
        ctx.ellipse(
            adPos.x, adPos.y,
            self.size * vp.zoomFactor, self.size * vp.zoomFactor,
            0,
            0, 2 * Math.PI);
        ctx.fill();
    }

    strokeCircle(vp, ctx, scale = 1) {
        const self = this;
        const adPos = vp.canvasToViewSpace(self.position);
        ctx.beginPath();
        ctx.ellipse(
            adPos.x, adPos.y,
            self.size * vp.zoomFactor * scale, self.size * vp.zoomFactor * scale,
            0,
            0, 2 * Math.PI);
        ctx.stroke();
    }

    onMouseEntered(vp) {
        // console.log("ENTER");
    }

    onMouseExited(vp) {
        // console.log("EXIT");
    }

    /** Called when the mouse is pressed over an object */
    onPressed(vp) {
        // console.log("DOWN");
    }

    /** 
     * Called when the mouse is released after having been pressed on the object, disregarding intermediate/final movements/position.
     * Called before both onDragEnded and onClicked
    */
    onUnpressed(vp) {
        // console.log("UP");
    }

    /** Called when the mouse is released over an object, regardless of whether it was pressed on the object */
    onMouseUp(vp) {
        // console.log("UP");
    }

    /** Called when the mouse is pressed on object and moved a minimum distance */
    onDragStarted(vp) {
        // console.log("!! UP");
    }

    /** Called when the mouse is pressed on object and released, after moving a minimum distance */
    onDragEnded(vp) {
        // console.log("!! UP");
    }

    /** Called when the mouse is pressed on object and released, after moving a limited distance */
    onClicked(vp) {
        // console.log("CLICKED");
    }
}