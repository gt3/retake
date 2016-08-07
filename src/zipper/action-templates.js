class Recalibrate {
    constructor(shiftBy, columns) {
        Object.assign(this, {shiftBy, columns})
    }
    get diff() { return this.columns - this.shiftBy }
    get recalibrated() {
        return zipper => {
            if(this.diff <= 0) return {archived: zipper.resultList, zipper}
            const diffZipper = this.diffAction(zipper), recalibrated = this.recalibrateAction(diffZipper)
            const archived = this.archiveAction(diffZipper, recalibrated)
            return {archived, zipper: recalibrated}
        }
    }
}

class ForwardActions extends Recalibrate {
    get nativeAction() {
        return z => z.unzip(this.columns)
    }
    get diffAction() {
        return z => z.zip(this.diff)
    }
    get recalibrateAction() {
        return z => z.unzip(this.shiftBy)
    }
    get archiveAction() {
        return (diffZipper, recalibrated) => recalibrated.resultList.prependCollection(diffZipper)
    }
}

class ReverseActions extends Recalibrate {
    get nativeAction() {
        return z => z.zip(this.columns)
    }
    get diffAction() {
        return z => z.unzip(this.diff)
    }
    get recalibrateAction() {
        return z => z.zip(this.shiftBy)
    }
    get archiveAction() {
        return (diffZipper, recalibrated) => diffZipper.resultList.prependCollection(recalibrated)
    }
}

function actionsSelector(shiftBy, columns = shiftBy) {
    return shiftBy < 0 ? new ReverseActions(-shiftBy, columns) : new ForwardActions(shiftBy, columns)
}

module.exports = actionsSelector
