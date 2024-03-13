class Building extends Sprite {
    constructor({
        position = { x: 0, y: 0 }, parentBuilding,
        sizeCells = { x: 2, y: 2 },
        cost = 5,
        imageSrc = "images/towers/Archer/ArcherBase.png",
        frames = {
            max: 1,
            columns: 3,
            rows: 1,
            row: 1,
            delay: 1,
            OffsetX: 0,
            OffsetY: 0
        },
        sizeSprite = {
            width: 2 * 48,
            height: 2 * 48
        }
    }) {
        super({
            position: position,
            imageSrc: imageSrc,
            frames: frames,
            size: sizeSprite
        })
        //this.position = position

        this.parentBuilding = parentBuilding
        if (parentBuilding === null) {
            this.parentBuilding = this
        }
        this.childBuildings = []
        this.sizeCells = sizeCells
        this.center = {
            x: this.position.x + (this.sizeCells.x % 2) * 48 / 2,
            y: this.position.y + (this.sizeCells.y % 2) * 48 / 2
        }

        this.projectiles = []
        this.radius = 200
        this.target = []
        this.projDamage = 20
        this.projSpead = 5

        this.level = 0
        this.fireRate = 2 * 60
        this.timer = 0
        this.cost = cost

        this.debufs

        this.towerImg
        this.projImg
    }
    draw() {
        // if (this.towerImg === undefined || this.towerImg === null) {
        //console.log("tower draw",this)
        // c.fillStyle = "blue"
        // c.fillRect(this.position.x, this.position.y, 48, 48)
        // this.childBuildings.forEach(child => {
        //     c.fillRect(child.position.x, child.position.y, 48, 48)
        // })
        // }
        //this.drawRadius()
        super.draw({ Building: true })
    }
    drawRadius() {
        c.strokeStyle = "rgba(50, 50, 255, 0.3)"
        c.lineWidth = 10
        c.beginPath()
        c.arc(this.center.x, this.center.y, this.radius, 0, Math.PI * 2)
        c.stroke()
    }
    update() {
        this.draw()
        const lenght = this.target.length
        if (this.timer % this.fireRate === 0 && this.target && lenght !== 0) {

            this.projectiles.push(
                new Projectile({
                    position: {
                        x: this.center.x,
                        y: this.center.y
                    },
                    enemy: this.target[0],
                    damage: this.projDamage,
                    spead: this.projSpead
                }))
            this.timer++
        }
        if (this.timer % this.fireRate !== 0) {
            this.timer++
        }
    }
    centerUpdate() {
        this.center = {
            x: this.position.x + (this.sizeCells.x % 2) * 48 / 2,
            y: this.position.y + (this.sizeCells.y % 2) * 48 / 2
        }
    }
}

class Archer extends Building {
    constructor({ position = { x: 0, y: 0 }, parentBuilding = null }) {
        super({
            position: position, sizeCells: { x: 2, y: 2 }, cost: 10,
            imageSrc: "images/towers/Archer/ArcherBase.png",
            frames: {
                max: 1,
                columns: 3,
                rows: 1,
                row: 1,
                delay: 7,
                OffsetX: 0,
                OffsetY: 20
            },
            sizeSprite: {
                width: 2 * 48,
                height: 2 * 48
            }
        })
        if (parentBuilding !== null) {
            this.parentBuilding = parentBuilding
        }
        this.radius = 200
        this.projDamage = 20
        this.projSpead = 5
        this.fireRate = 2 * 60
    }
    update() {
        this.draw()
        const lenght = this.target.length
        if (this.timer % this.fireRate === 0 && this.target && lenght !== 0) {

            this.projectiles.push(
                new ArcherProjectile({
                    position: {
                        x: this.center.x,
                        y: this.center.y
                    },
                    target: this.target[0],
                    damage: this.projDamage,
                    spead: this.projSpead
                }))
            this.timer++
        }
        if (this.timer % this.fireRate !== 0) {
            this.timer++
        }
    }
}
class Mortir extends Building {
    constructor({ position = { x: 0, y: 0 }, parentBuilding = null }) {
        super({
            position: position, sizeCells: { x: 3, y: 3 }, cost: 50,
            imageSrc: "images/towers/Mortir/MortirBase.png",
            frames: {
                max: 1,
                columns: 3,
                rows: 1,
                row: 1,
                delay: 7,
                OffsetX: 0,
                OffsetY: 20
            },
            sizeSprite: {
                width: 3 * 48,
                height: 3 * 48
            }
        })
        if (parentBuilding !== null) {
            this.parentBuilding = parentBuilding
        }
        this.radius = 200

        this.projDamage = 40
        this.projSpead = 6
        this.fireRate = 4.6 * 60
        this.projExplosionRadius = 2 * 48
    }
    update() {
        this.draw()
        const lenght = this.target.length
        if (this.timer % this.fireRate === 0 && this.target && lenght !== 0) {

            this.projectiles.push(
                new MortirProjectile({
                    position: {
                        x: this.center.x,
                        y: this.center.y
                    },
                    target: this.target[0],
                    //enemys:
                    damage: this.projDamage,
                    spead: this.projSpead,
                    explosionRadius: this.projExplosionRadius
                }))
            this.timer++
        }
        if (this.timer % this.fireRate !== 0) {
            this.timer++
        }
    }
}

class Mage extends Building {
    constructor({ position = { x: 0, y: 0 }, parentBuilding = null }) {
        super({
            position: position, sizeCells: { x: 2, y: 2 }, cost: 30,
            imageSrc: "images/towers/Mage/MageBase.png",
            frames: {
                max: 1,
                columns: 3,
                rows: 1,
                row: 1,
                delay: 7,
                OffsetX: 0,
                OffsetY: 80
            },
            sizeSprite: {
                width: 2 * 48,
                height: 2 * 48
            }
        })
        if (parentBuilding !== null) {
            this.parentBuilding = parentBuilding
        }
        this.radius = 200
        this.projDamage = 0.5
        // this.projSpead = 5
        this.fireRate = 1 * 60

        this.debufs = {
            speadDown: {
                chance: 100,
                power: 30,
                duration: 1 * 60
            },
            stun: {
                chance: 5,
                power: 100,
                duration: 0.5 * 60
            }
        }
    }
    update() {
        this.draw()
        const lenght = this.target.length
        if (this.timer % this.fireRate === 0 && this.target && lenght !== 0) {
            this.target.forEach(enemy => {
                //debuff
                if (Math.random() <= this.debufs.speadDown.chance / 100) {

                    let spd = {
                        power: this.debufs.speadDown.power,
                        duration: this.debufs.speadDown.duration
                    }
                    enemy.debuf.speadDown.push(spd)
                }
                if (Math.random() <= this.debufs.stun.chance / 100) {
                    let spd = {
                        power: this.debufs.stun.power,
                        duration: this.debufs.stun.duration
                    }
                    enemy.debuf.stun.push(spd)
                }
                //damage
                enemy.health -= this.projDamage
            })

            this.timer++
        }
        if (this.timer % this.fireRate !== 0) {
            this.timer++
        }
    }
}