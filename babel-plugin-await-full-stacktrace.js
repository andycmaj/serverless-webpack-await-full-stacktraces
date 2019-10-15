// see  https://github.com/amio-io/await-trace/blob/master/src/main.js

module.exports = function() {
  // eslint-disable-next-line prefer-rest-params
  const t = arguments[0].types;

  return {
    name: 'await-full-stacktrace',
    pre() {
      this.visited = new Map();
    },
    visitor: {
      AwaitExpression: function(path) {
        if (this.visited.has(path.node)) {
          return;
        }

        // await (async function(createErr) {
        //   try {
        //     return await fun();
        //   } catch (awaitTraceErr) {
        //     let err = createError();
        //     awaitTraceErr.stack += "\n...\n" + err.Stack;
        //     throw awaitTraceErr;
        //   }
        // })(() => new Error())

        // TODO: extract wrapper to common function. would save a bunch of module space

        const uniqAwaitTraceErr = path.scope.generateUidIdentifier(
          'awaitTraceErr'
        );

        const amendErrStack = [
          // let err = createError();
          t.variableDeclaration('let', [
            t.variableDeclarator(
              t.identifier('err'),
              t.callExpression(t.identifier('createError'), [])
            ),
          ]),
          // awaitTraceErr.stack += newErr.Stack;
          t.expressionStatement(
            t.assignmentExpression(
              '+=',
              t.memberExpression(uniqAwaitTraceErr, t.identifier('stack')),
              t.binaryExpression(
                '+',
                t.stringLiteral('\n...\n'),
                t.memberExpression(t.identifier('err'), t.identifier('stack'))
              )
            )
          ),
          // throw awaitTraceErr;
          t.throwStatement(uniqAwaitTraceErr),
        ];

        // try { ... } catch (awaitTraceErr) { ... }
        const tryCatch = t.tryStatement(
          t.blockStatement([t.returnStatement(path.node)]),
          t.catchClause(uniqAwaitTraceErr, t.blockStatement(amendErrStack))
        );

        // await (async (createErr) => { ... })(() => new Error())
        const replacement = t.awaitExpression(
          t.callExpression(
            t.arrowFunctionExpression(
              // params
              [t.identifier('createError')],
              // body
              t.blockStatement([tryCatch]),
              // async
              true
            ),
            [
              t.arrowFunctionExpression(
                // params
                [],
                // body
                t.newExpression(t.identifier('Error'), []),
                // async
                false
              ),
            ]
          )
        );

        this.visited.set(path.node, true);
        this.visited.set(replacement, true);

        path.replaceWith(replacement);
      },
    },
  };
};
