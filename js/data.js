// 即兴练习数据模块
export function createImprovisationData() {
    // 创建树节点的辅助函数
    const createNode = (name, children = []) => ({ name, children });
    
    // 创建叶子节点
    const createLeaf = (name) => ({ name, children: [] });
    
    // 创建上行下行模式
    const createDirectionalPattern = (name) => createNode(name, [
        createLeaf("上行"),
        createLeaf("下行")
    ]);
    
    // 定义通用的模进结构
    const createSequencePatterns = () => [
        createDirectionalPattern("模进"),
        createDirectionalPattern("之字模进")
    ];

    // 使用标准树节点结构
    const improvisationTree = createNode("根节点", [
        createNode("琶音", [
            createNode("三音组", createSequencePatterns()),
            createNode("四音组", createSequencePatterns()),
            createNode("隔一音", createSequencePatterns())
        ]),
        createNode("五声音阶", [
            createNode("三音组", createSequencePatterns()),
            createNode("四音组", createSequencePatterns()),
            createNode("六音组", createSequencePatterns()),
            createNode("隔一音", createSequencePatterns()),
            createNode("隔两音", createSequencePatterns())
        ]),
        createNode("自然音阶", [
            createNode("三音组", createSequencePatterns()),
            createNode("四音组", createSequencePatterns()),
            createNode("三度", createSequencePatterns()),
            createNode("四度", createSequencePatterns())
        ]),
        createNode("Legato", [
            createNode("三音组", [
                createLeaf("123"),
                createLeaf("132")
            ]),
            createNode("四音组", [
                createLeaf("1323"),
                createLeaf("3231"),
                createDirectionalPattern("模进")
            ]),
            createNode("六音组", [
                createLeaf("132123"),
                createLeaf("312321"),
                createDirectionalPattern("模进")
            ]),
            createNode("三度", [
                createDirectionalPattern("模进")
            ])
        ])
    ]);

    return improvisationTree;
}