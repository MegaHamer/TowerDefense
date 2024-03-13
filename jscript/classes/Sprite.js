class Sprite {
    constructor({
        position = { x: 0, y: 0 },
        imageSrc,
        frames = {
            max: 1,
            columns: 1,
            rows: 1,
            row: 1,
            delay,
            OffsetX: 0,
            OffsetY: 0
        },
        size = {
            width: 100,
            height: 100
        }
    }) {
        this.size = size
        this.position = position
        this.image = new Image()
        this.image.src = imageSrc
        this.frames = {
            max: frames.max,
            current: 0,
            timer: 0,
            delay: frames.delay,
            columns: frames.columns,
            rows: frames.rows,
            row: frames.row,
            offsetX: frames.OffsetX,
            offsetY: frames.OffsetY
        }
    }
    draw({ projectile = false, Building = false }) {
        const sprite = {
            width: this.image.width / this.frames.columns,
            height: this.image.height / this.frames.rows
        }
        const frame = {
            position: {
                x: sprite.width * this.frames.current,
                y: this.frames.row
            }
        }
        //console.log(frame.position.x)
        if (projectile) {
            c.drawImage(
                this.image,
                frame.position.x + this.frames.offsetX,
                frame.position.y + this.frames.offsetY,
                sprite.width - this.frames.offsetX,
                sprite.height - this.frames.offsetY,
                0,
                0,
                this.size.width,
                this.size.height
            )
        }
        else if (Building) {

            c.drawImage(
                this.image,
                frame.position.x + this.frames.offsetX,
                frame.position.y + this.frames.offsetY,
                sprite.width - this.frames.offsetX,
                sprite.height - this.frames.offsetY,
                this.position.x -48,
                this.position.y -48,
                this.size.width,
                this.size.height
            )
        }
        else
            c.drawImage(
                this.image,
                frame.position.x + this.frames.offsetX,
                frame.position.y + this.frames.offsetY,
                sprite.width - this.frames.offsetX,
                sprite.height - this.frames.offsetY,
                this.position.x,
                this.position.y,
                this.size.width,
                this.size.height
            )
        this.frames.timer++
        if (this.frames.timer % this.frames.delay === 0) {
            //console.log(this.frames.offsetY)
            //console.log(this.frames.current, this.frames.max)
            this.frames.current++
            if (this.frames.current >= this.frames.max) {
                this.frames.current = 0
            }
        }
    }
}