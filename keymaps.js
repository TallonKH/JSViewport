// does not require other Viewport components to function
class KeyMapHandler {
    constructor() {
        this.contextStack = [];
        this.allMapGroups = [];

        this.activeMappings = [];
    }

    setupListeners(){
        //TODO figure out good system for telling the handler what the current active context is
        // (pass supercontexts, and append top layer context?)
    }

    recalc() {
        const groupsFiltered = [];
        for (const group of this.allMapGroups) {
            if (group.matches(this.contextStack)) {
                groupsFiltered.push(group);
            }
        }
        groupsFiltered.sort((a, b) => {
            const ap = a.contextMatcher.priority;
            const bp = b.contextMatcher.priority;
            return (bp[0] - ap[0]) || (bp[1] - ap[1]);
        });

        this.activeMappings = [];
        const self = this;

        groupsFiltered.forEach(group => {
            group.keyMappings.forEach(mapping => {
                self.activeMappings.push(mapping);
            });
        });
    }
}

class ContextMatcher {
    static contextModes = Object.freeze({
        "equals": {
            name: "equals",
            priority: 10,
            desc: ls => `Context matches: [${ls}]`,
            comparison: function (active, checks) {
                if (active.length != checks.length) {
                    return false;
                }
                for (let i = 0; i < active.length && i < checks.length; i++) {
                    if (active[i] != checks[i]) {
                        return false;
                    }
                }
                return true;
            }
        },
        "suffix": {
            name: "suffix",
            priority: 8,
            desc: ls => `Context ends with: [${ls}]`,
            comparison: function (active, checks) {
                if (active.length < checks.length) {
                    return false;
                }
                for (let i = 0, j = active.length - checks.length; i < checks.length; i++, j++) {
                    if (active[j] != checks[i]) {
                        return false;
                    }
                }
                return true;
            }
        },
        "prefix": {
            name: "prefix",
            priority: 6,
            desc: ls => `Context begins with: [${ls}]`,
            comparison: function (active, checks) {
                if (active.length < checks.length) {
                    return false;
                }
                for (let i = 0; i < checks.length; i++) {
                    if (active[i] != checks[i]) {
                        return false;
                    }
                }
                return true;
            }
        },
        "hasSeq": {
            name: "hasSeq",
            priority: 4,
            desc: ls => `Context contains sequence: [${ls}]`,
            comparison: function (active, checks) {
                if (active.length < checks.length) {
                    return false;
                }
                for (i = 0; i <= active.length - checks.length; i++) {
                    let success = true;
                    for (j = 0; j < checks.length; j++) {
                        if (active[i + j] != checks[j]) {
                            success = false;
                            break;
                        }
                    }
                    if (success) {
                        return true;
                    }
                }
                return false;
            }
        },
        "hasAll": {
            name: "hasAll",
            priority: 2,
            desc: ls => `Context contains all: [${ls}]`,
            comparison: function (active, checks) {
                return checks.every(a => active.includes(a));
            }
        },
        "global": {
            name: "global",
            priority: 0,
            desc: _ => `Any Context`,
            comparison: (a, b) => true
        }
    });

    constructor(mode, terms) {
        this.mode = mode;
        this.terms = terms;
        this.priority = [ContextMatcher.contextModes[mode], terms.length];
        this.comparison = active => ContextMatcher.contextModes[mode].comparison(active, terms);
    }

    getDescription() {
        return ContextMatcher.contextModes[this.mode].desc(this.terms);
    }
}

//TODO do this
class KeyCombo {
    constructor() {
        this.key;
        this.needsAlt;
        this.needsCtrl;
        this.needsMacCtrl;
        this.needsFunction;
    }
}

class ContextGroup {
    constructor(contextMatcher, keyMappings) {
        this.contextMatcher = contextMatcher;
        this.keyMappings = keyMappings;
    }

    matches(active) {
        return this.contextMatcher.comparison(active);
    }
}

class KeyMapping {
    constructor(keys, action) {
        this.keys = keys;
        this.contextMatcher = contextMatcher;
        this.action = action;
        this.id = idCounter++;
    }
}

function loneKeyMap(contextMatcher, keys, action) {
    return new ContextGroup(contextMatcher, [new KeyMapping(keys, action)]);
}

function example() {
    const handler = new KeyMapHandler();
    handler.contextStack = ["aaa", "bbb", "ccc", "ddd"];

    handler.allMapGroups.push(new ContextGroup(
        new ContextMatcher("suffix", ["ccc", "ddd"]),
        ["a", "b"]
    ));

    handler.allMapGroups.push(new ContextGroup(
        new ContextMatcher("equals", ["aaa", "bbb", "ccc", "ddd"]),
        ["c", "d"]
    ));

    handler.recalc();
    console.log(handler.activeMappings);
}

example();