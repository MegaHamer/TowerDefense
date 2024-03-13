
class Enemy extends Sprite {
    constructor({
        position = { x: 0, y: 0 },
        HP = 100,
        spead = 1,
        summonPrice = 50,
        gold = 1,
        imageSrc = "images/Enemies/Necromancer/Necromancer_creativekind-Sheet.png",
        frames = {
            max: 8,
            columns: 17,
            rows: 7,
            row: 1,
            delay: 7,
            OffsetX: 50,
            OffsetY: 50
        },
        size ={
            width:100,
            height:100
        }
    }) {
        super({
            position: position,
            imageSrc: imageSrc,//"images/Enemies/Necromancer/Necromancer_creativekind-Sheet.png",
            frames: frames,
            size:size
        })
        this.position = position
        this.width = 100
        this.height = 100
        this.waypointIndex = 0
        this.center = {
            x: this.position.x + this.width / 2,
            y: this.position.y + this.height / 2
        }
        this.radius = 50
        this.maxHP = HP
        this.health = this.maxHP
        this.spead = spead
        this.summonPrice = summonPrice
        this.gold = gold

        this.debuf = {
            speadDown: [],
            stun: [],
            blead: []
        }
    }

    draw() {
        // c.fillStyle = "red"
        // //c.fillRect(this.position.x, this.position.y, this.width, this.height)
        // c.beginPath()
        // c.arc(this.center.x, this.center.y, this.radius, 0, Math.PI * 2)
        // c.fill()
        super.draw({})
        //hp
        c.fillStyle = "red"
        c.fillRect(this.position.x, this.position.y - 15, this.width, 10)

        c.fillStyle = "green"
        c.fillRect(this.position.x, this.position.y - 15, this.width * this.health / this.maxHP, 10)
    }
    move() {

        let spDownDebuff = 0
        if (this.debuf.speadDown[0]) {
            //console.log(this.debuf.speadDown[0])
            this.debuf.speadDown.sort(function (a, b) {
                return b.power - a.power
            })
            spDownDebuff = this.debuf.speadDown[0].power / 100

            for (let i = 0; i < this.debuf.speadDown.length; i++) {
                const debuf = this.debuf.speadDown[i]
                debuf.duration -= 1
                if (debuf.duration <= 0) {
                    this.debuf.speadDown.splice(i, 1)
                }
            }
        }
        if (this.debuf.stun[0]) {
            for (let i = 0; i < this.debuf.stun.length; i++) {
                const debuf = this.debuf.stun[i]
                debuf.duration -= 1
                if (debuf.duration <= 0) {
                    this.debuf.stun.splice(i, 1)
                }
            }
            spDownDebuff = 1
        }

        const waypoint = waypoints[this.waypointIndex]
        const yDistance = (waypoint.y + mapOffset.y) - this.center.y
        const xDistance = (waypoint.x + mapOffset.x) - this.center.x
        const angle = Math.atan2(yDistance, xDistance)
        //console.log(waypoint.y + mapOffset.y - this.center.y )

        this.position.x += Math.cos(angle) * (this.spead * (1 - spDownDebuff))
        this.position.y += Math.sin(angle) * (this.spead * (1 - spDownDebuff))
        this.center = {
            x: this.position.x + this.width / 2,
            y: this.position.y + this.height / 2
        }

        const xD = this.center.x - (waypoint.x + mapOffset.x)
        const yD = this.center.y - (waypoint.y + mapOffset.y)
        const dist = Math.hypot(xD, yD)
        if (dist <= this.spead &&
            this.waypointIndex < waypoints.length - 1) {
            this.waypointIndex++
        }

    }

    update() {
        this.draw()
        this.move()
    }
}
class Necromancer extends Enemy {
    constructor({ position = { x: 0, y: 0 }, HP = 100, spead = 1, summonPrice = 100, gold = 30 }) {
        super({
            position: position,
            HP: HP,
            spead: spead,
            summonPrice: summonPrice,
            gold: gold,
            imageSrc: "images/Enemies/Necromancer/Necromancer_creativekind-Sheet.png",
            frames: {
                max: 8,
                columns: 17,
                rows: 7,
                row: 1,
                delay: 7,
                OffsetX: 50,
                OffsetY: 50
            },
            size:{
                width:200,
                height:120
            }
        })
    }
}
class Skeleton extends Enemy{
    constructor({ position = { x: 0, y: 0 }, HP = 100, spead = 1, summonPrice = 100, gold = 4 }) {
        super({
            position: position,
            HP: HP,
            spead: spead,
            summonPrice: summonPrice,
            gold: gold,
            imageSrc: "images/Enemies/Skeleton/skeletonWalk.png",
            frames: {
                max: 8,
                columns: 8,
                rows: 1,
                row: 1,
                delay: 7,
                OffsetX: 0,
                OffsetY: 0
            }
        })
    }
}