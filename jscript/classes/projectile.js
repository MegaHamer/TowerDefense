class Projectile extends Sprite {
    constructor({
        position = { x: 0, y: 0 },
        target,
        damage = 20,
        spead = 5,
        imageSrc = "images/towers/Archer/ArcherProjectile.png",
        frames = {
            max: 3,
            columns: 3,
            rows: 1,
            row: 1,
            delay: 7,
            OffsetX: 0,
            OffsetY: 0
        },
        size = {
            width: 10,
            height: 50
        } }) {
        super({
            position: position,
            imageSrc: imageSrc,
            frames: frames,
            size: size
        })
        this.position = position
        this.velocity = {
            x: 0,
            y: 0
        }
        this.target = target
        this.radius = 10
        this.damage = damage
        this.spead = spead
    }

    draw() {
        // c.beginPath()
        // c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        // c.fillStyle = "orange"
        // c.fill()
        c.save()
        const angle = Math.atan2(
            this.target.center.y - this.position.y,
            this.target.center.x - this.position.x
        )
        var rad = 90 * Math.PI / 180
        c.translate(this.position.x, this.position.y)
        //console.log(this.position.x, this.position.y)
        c.rotate(angle + rad)
        //c.fillStyle = "red"
        //c.fillRect(0, 0, 100, 100)
        super.draw({ projectile: true })
        c.restore()
    }
    move() {
        const angle = Math.atan2(
            this.target.center.y - this.position.y,
            this.target.center.x - this.position.x
        )

        this.velocity.x = Math.cos(angle) * this.spead
        this.velocity.y = Math.sin(angle) * this.spead

        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
    update() {
        this.draw()

        this.move()

        const xD = this.target.center.x - this.position.x
        const yD = this.target.center.y - this.position.y
        const dist = Math.hypot(xD, yD)
        if (dist < this.target.radius + this.radius) {
            //damage
            this.target.health -= this.damage
            if (this.target.health <= 0) {
                const indEnemy = enemys.findIndex((target) => {
                    return target === this.target
                })
                if (indEnemy > -1) {
                    score += enemys[indEnemy].summonPrice
                    gold += enemys[indEnemy].gold
                    enemys.splice(indEnemy, 1)
                }
            }
            //
            if (enemys.length === 0) {
                spawnEnemys(score)
            }
            //console.log(this.target)
            return true
            // building.projectiles.splice(i, 1)
        }
        return false
    }
}
class ArcherProjectile extends Projectile {
    constructor({ position = { x: 0, y: 0 }, target, damage = 20, spead = 5 }) {
        super({
            position: position,
            target: target,
            damage: damage,
            spead: spead
        })
    }
    update() {
        return super.update()
    }

}
class MortirProjectile extends Projectile {
    constructor({ position = { x: 0, y: 0 }, target, damage = 40, spead = 6, explosionRadius = 50 }) {
        super({
            position: position, target: target, damage, spead,
            imageSrc: "images/towers/Mortir/MortirProjectile.png",
            frames: {
                max: 8,
                columns: 8,
                rows: 1,
                row: 1,
                delay: 2,
                OffsetX: 0,
                OffsetY: 0
            },
            size : {
                width: 30,
                height: 30
            }
        })
        //this.enemys = enemys
        this.explosionRadius = explosionRadius
    }

    // move() {
    //     const angle = Math.atan2(
    //         this.target.center.y - this.position.y,
    //         this.target.center.x - this.position.x
    //     )

    //     this.velocity.x = Math.cos(angle) * this.spead
    //     this.velocity.y = Math.sin(angle) * this.spead

    //     this.position.x += this.velocity.x
    //     this.position.y += this.velocity.y
    // }
    update() {
        this.draw()
        this.move()

        const xD = this.target.center.x - this.position.x
        const yD = this.target.center.y - this.position.y
        const dist = Math.hypot(xD, yD)
        if (dist < this.target.radius + this.radius) {
            //detonate
            enemys.forEach(enemye => {
                const xDD = enemye.center.x - this.position.x
                const yDD = enemye.center.y - this.position.y
                const distD = Math.hypot(xDD, yDD)
                if (distD < enemye.radius + this.explosionRadius) {
                    enemye.health -= this.damage
                    if (enemye.health <= 0) {
                        const indEnemy = enemys.findIndex((enemyy) => {
                            return enemye === enemyy
                        })
                        if (indEnemy > -1) {
                            score += enemys[indEnemy].summonPrice
                            gold += enemys[indEnemy].gold
                            enemys.splice(indEnemy, 1)
                        }
                    }
                }

            });
            //
            if (enemys.length === 0) {
                spawnEnemys(score)
            }
            //console.log(this.enemy)
            return true
            // building.projectiles.splice(i, 1)
        }
        return false
    }
}