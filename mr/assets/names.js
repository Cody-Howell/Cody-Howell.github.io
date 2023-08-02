const names = [
    {   
        name: 'Web 1', 
        info: `Inital web I created. I'm happy about where it began, but the ratio of stuff I like is maybe 5:1, dislike-like.`,
        author_route: 'AA AB AC AK AE AH AM AN AO AR AE AN AO AS AT', 
        seed: -3,
        complex: {
            setArray: [ 0 ],
            rules: {
                init: [],
                running: [
                    {
                        index: 0,
                        action: "set",
                        amount: 1,
                        condition: {
                            "visited": "AN"
                        }
                    }
                ]
            },
            arrayRules: [
                {
                    end: 1,
                    loop: false
                }
            ]
        }
    },
    {   
        name: 'Web 2',  
        info: `Second web I created, solo. I like a lot more of the nodes, maybe a 3:1 like-dislike. Recently became Complex.`,
        author_route: 'AU AV BF AG AH AZ BA BB BC BB BC BD AA AB AC AD AE AF AY AH AI AJ AK AL AM',
        seed: 1,
        complex: {
            setArray: [ 0 ],
            rules: {
                init: [],
                running: [
                    {
                        index: 0,
                        action: "set",
                        amount: 1,
                        condition: {
                            "sequenceMatches": [ "BB", "BC", "BB" ]
                        }
                    },
                    {
                        index: 0,
                        action: "set",
                        amount: 0,
                        condition: {
                            "sequenceMatches": [ "BB", "BC", "BB", "BC", "BD" ]
                        }
                    }
                ]
            },
            arrayRules: [
                {
                    end: 1,
                    loop: false
                }
            ]
        }
    },
    {   
        name: 'Web 3', 
        info: `Newest web, or Percussion web. Currently being built.`,
        author_route: 'GA GB GC GD GE GF GG GH',
        seed: 2
    },
    {   
        name: 'Test', 
        info: `Test array for visualizations and complex tests.`,
        author_route: 'AU AV BF AG AH AZ BA BB BC BB BC BD AA AB AC AD AE AF AY AH AI AJ AK AL AM', 
        seed: 1,
        complex: {
            setArray: [ 0, 0, 0, 0 ],
            rules: {
                init: [],
                running: [
                    {
                        index: 0,
                        action: "set",
                        amount: 1,
                        condition: {
                            "sequenceMatches": [ "BB", "BC", "BB" ]
                        }
                    },
                    {
                        index: 0,
                        action: "set",
                        amount: 0,
                        condition: {
                            "sequenceMatches": [ "BB", "BC", "BB", "BC", "BD" ]
                        }
                    }
                ]
            },
            arrayRules: [
                {
                    end: 1,
                    loop: false
                },
                {
                    end: 1,
                    loop: false
                }
            ]
        }
    }
];

export {names}