import $ from "jquery";

export default function UndoBuffer() {
    this.buffer = [];
    this.pos = -1;
    
    this.undo = function (step) {
        if ( this.buffer.length === 0 ) {
            throw new Error("Buffer is empty");
        }
        if ( this.pos - step < 0 ) {
            throw new Error("Undo step too big");
        }

        this.pos -= step;
        $("#undo-pos").html(`${this.pos}/${this.buffer.length}`);
        return this.buffer[this.pos];

    };

    this.redo = function (step) {
        if ( this.buffer.length === 0 ) {
            throw new Error("Buffer is empty");
        }
        if ( this.pos + step >= this.buffer.length ) {
            throw new Error("Redo step too big");
        }
        
        this.pos += step;
        $("#undo-pos").html(`${this.pos}/${this.buffer.length}`);
        return this.buffer[this.pos];
    };

    this.push = function (data) {
        if ( this.pos == this.buffer.length - 1 ) {
            this.buffer.push(data);
            this.pos = this.buffer.length - 1;
        } else {
            this.buffer[++this.pos] = data;
        }
        $("#undo-pos").html(`${this.pos}/${this.buffer.length}`);
    };

    this.getCurrent = function () {
        return this.buffer[this.pos];
    };

}
