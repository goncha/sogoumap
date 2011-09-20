function StageAssistant() {
}

StageAssistant.prototype.setup = function() {
    Mojo.Controller.stageController.pushScene({name:"map", disableSceneScroller:true});
};
