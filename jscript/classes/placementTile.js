class PlacementTile {
    constructor({ position = { x: 0, y: 0 } }) {
        this.position = position
        this.building = undefined
        this.neighbourTiles = []
        this.size = 48
        this.color = "rgba(255, 255, 255, 0.1)"
    }
    draw() {
        c.fillStyle = this.color
        c.fillRect(this.position.x, this.position.y, this.size, this.size)
    }
    update(mouse, building = new Building({})) {
        this.draw()

        if (
            mouse.x > this.position.x &&
            mouse.x < this.position.x + this.size &&
            mouse.y > this.position.y &&
            mouse.y < this.position.y + this.size
        ) {

            //tower and radius
            building.position.x = this.position.x
            building.position.y = this.position.y
            building.center = {
                x: building.position.x + (building.size.x % 2) * 48 / 2,
                y: building.position.y + (building.size.y % 2) * 48 / 2
            }
            building.draw()
            building.drawRadius()
            //colored cells

            this.color = "rgba( 255, 0, 0, 0.5"
            if (this.canBuild(building) && gold - building.cost >= 0) {
                this.color = "rgba(0, 255, 0, 0.5"
            }

            const bSize = building.sizeCells
            const tileInd = this.position.x / this.size
            const rowInd = this.position.y / this.size

            const iStart = Math.floor(bSize.x / 2), jStart = Math.floor(bSize.y / 2)
            for (let i = -iStart; i < bSize.x - iStart; i++) {
                for (let j = -jStart; j < bSize.y - jStart; j++) {
                    const xx = i + tileInd
                    const yy = j + rowInd
                    
                    c.fillStyle = this.color
                    c.fillRect(
                        xx * this.size,
                        yy * this.size,
                        this.size,
                        this.size)
                }
            }
        }
        else {
            this.color = "rgba(255, 255, 255, 0.1)"
        }
    }
    addBuild(building) {
        if (this.canBuild(building)) {
            console.log("поставил")
            //console.log(building)
            this.building = building //parent

            const bSize = building.sizeCells
            const tileInd = this.position.x / this.size
            const rowInd = this.position.y / this.size

            const iStart = Math.floor(bSize.x / 2), jStart = Math.floor(bSize.y / 2)

            for (let i = -iStart; i < bSize.x - iStart; i++) {
                for (let j = -jStart; j < bSize.y - jStart; j++) {
                    const xx = i + tileInd
                    const yy = j + rowInd
                    if (i !== 0 || j !== 0) {
                        const child = new Building({
                            position: { x: xx * 48, y: yy * 48 },
                            parentBuilding: building
                        })
                        this.IsNeighbour(xx, yy).building = child
                        building.childBuildings.push(child)
                        //console.log(building)
                    }
                }
            }

            return true
        }
        return false

    }
    canBuild(building) {
        const bSize = building.sizeCells
        const tileInd = this.position.x / this.size
        const rowInd = this.position.y / this.size

        const iStart = Math.floor(bSize.x / 2), jStart = Math.floor(bSize.y / 2)
        //console.log(iStart,jStart)
        // if (
        //     bSize.x === 2 &&
        //     bSize.y === 2
        // )
        if (this.building !== null && this.building !== undefined) {
            console.log("ddd")
            return false
        }
        for (let i = -iStart; i < bSize.x - iStart; i++) {
            for (let j = -jStart; j < bSize.y - jStart; j++) {
                const xx = i + tileInd
                const yy = j + rowInd
                if (i !== 0 || j !== 0) {
                    if (
                        this.IsNeighbour(xx, yy) === null ||
                        this.IsNeighbour(xx, yy).building !== undefined
                    ) {
                        return false
                    }
                }
            }
        }

        return true
    }
    IsNeighbour(x, y) {
        for (let i = 0; i < this.neighbourTiles.length; i++) {
            const nTile = this.neighbourTiles[i]
            if (
                nTile.position.x === Math.round(x * nTile.size) &&
                nTile.position.y === Math.round(y * nTile.size)
            ) {
                return nTile
                break
            }
        }
        return null
    }
}