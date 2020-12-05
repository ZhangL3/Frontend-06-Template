public class TestCloning {

    public static void main(String[] args) {

        CloneFactory animalMaker = new CloneFactory();

        Sheep sally = new Sheep();

//      新的克隆羊不是直接实例化 Sheep，而是复制了已经有个 constance Sally。
//      这里是 deep clone 还是 shallow 克隆是值得思考的
        Sheep clonedSheep = (Sheep) animalMaker.getClone(sally);
//        直接复制也可以，用工厂模式让 clone 操作更清晰
//        Sheep clonedSheep = (Sheep) sally.makeCopy();

        System.out.println(sally);

        System.out.println(clonedSheep);

        System.out.println("Sally Hashcode: " + System.identityHashCode(System.identityHashCode((sally))));

        System.out.println("Clone Hashcode: " + System.identityHashCode(System.identityHashCode((clonedSheep))));
    }

}
