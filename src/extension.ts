'use strict';
import * as vscode from 'vscode';
import * as HeaderFunctions from './header-functions';
import * as TimestampFunctions from './timestamp-functions';
import * as MarkupFunctions from './markup-functions';
import * as SubtreeFunctions from './subtree-functions';
import {
    incrementContext,
    decrementContext
} from './modify-context';
import * as PascuaneseFunctions from './pascuanese-functions';
import { OrgFoldingAndOutlineProvider } from './org-folding-and-outline-provider';

export function activate(context: vscode.ExtensionContext) {
    let insertHeadingRespectContentCmd = vscode.commands.registerTextEditorCommand('org.insertHeadingRespectContent', HeaderFunctions.insertHeadingRespectContent);
    let insertChildCmd = vscode.commands.registerTextEditorCommand('org.insertSubheading', HeaderFunctions.insertChild);
    let demoteLineCmd = vscode.commands.registerTextEditorCommand('org.doDemote', HeaderFunctions.demoteLine);
    let promoteLineCmd = vscode.commands.registerTextEditorCommand('org.doPromote', HeaderFunctions.promoteLine);
    let promoteSubtreeCmd = vscode.commands.registerTextEditorCommand('org.promoteSubtree', SubtreeFunctions.promoteSubtree);
    let demoteSubtreeCmd = vscode.commands.registerTextEditorCommand('org.demoteSubtree', SubtreeFunctions.demoteSubtree);

    let insertTimestampCmd = vscode.commands.registerTextEditorCommand('org.timestamp', TimestampFunctions.insertTimestamp);
    let clockInCmd = vscode.commands.registerTextEditorCommand('org.clockin', TimestampFunctions.clockIn);
    let clockOutCmd = vscode.commands.registerTextEditorCommand('org.clockout', TimestampFunctions.clockOut);
    let updateClockCmd = vscode.commands.registerTextEditorCommand('org.updateclock', TimestampFunctions.updateClock);

    let incrementContextCmd = vscode.commands.registerTextEditorCommand('org.incrementContext', incrementContext);

    let decrementContextCmd = vscode.commands.registerTextEditorCommand('org.decrementContext', decrementContext);

    const boldCmd = vscode.commands.registerTextEditorCommand('org.bold', MarkupFunctions.bold);
    const italicCmd = vscode.commands.registerTextEditorCommand('org.italic', MarkupFunctions.italic);
    const underlineCmd = vscode.commands.registerTextEditorCommand('org.underline', MarkupFunctions.underline);
    const codeCmd = vscode.commands.registerTextEditorCommand('org.code', MarkupFunctions.code);
    const verboseCmd = vscode.commands.registerTextEditorCommand('org.verbose', MarkupFunctions.verbose);
    const literalCmd = vscode.commands.registerTextEditorCommand('org.literal', MarkupFunctions.literal);
    const butterflyCmd = vscode.commands.registerTextEditorCommand('org.butterfly', PascuaneseFunctions.butterfly);

    context.subscriptions.push(insertHeadingRespectContentCmd);
    context.subscriptions.push(insertChildCmd);

    context.subscriptions.push(demoteLineCmd);
    context.subscriptions.push(promoteLineCmd);

    context.subscriptions.push(promoteSubtreeCmd);
    context.subscriptions.push(demoteSubtreeCmd);

    context.subscriptions.push(insertTimestampCmd);
    context.subscriptions.push(incrementContextCmd);
    context.subscriptions.push(decrementContextCmd);

    context.subscriptions.push(boldCmd);
    context.subscriptions.push(italicCmd);
    context.subscriptions.push(underlineCmd);
    context.subscriptions.push(codeCmd);
    context.subscriptions.push(verboseCmd);
    context.subscriptions.push(literalCmd);
    context.subscriptions.push(butterflyCmd);

    const provider = new OrgFoldingAndOutlineProvider();
    vscode.languages.registerFoldingRangeProvider('org', provider);
    vscode.languages.registerDocumentSymbolProvider('org', provider);



    /*   DECORATOR PROTOTYPE   */
    // from vscode extension example and prettify extension

    // §TODO : make a document handler for org documents. cf prettify
	console.log('decorator sample is activated');

	let timeout: NodeJS.Timer | undefined = undefined;

	const headersDecorationType = vscode.window.createTextEditorDecorationType({
		borderWidth: '1px',
		borderStyle: 'solid',
		overviewRulerColor: 'blue',
		overviewRulerLane: vscode.OverviewRulerLane.Right,
		light: {
			borderColor: 'darkblue'
		},
		dark: {
			borderColor: 'lightblue'
		}
	});

	let activeEditor = vscode.window.activeTextEditor;

	function updateDecorations() {
		if (!activeEditor) {
			return;
		}
		const regEx = /(?=\n|^)(\*+) /gm;
		const text = activeEditor.document.getText();
		const headers: vscode.DecorationOptions[] = [];
        let match;
        const showAttachmentStyling = '!important; font-size: 0.1pt !important; visibility: hidden' //'; letter-spacing: normal; visibility: visible';
        const XXX = vscode.window.createTextEditorDecorationType({
            // make multiple for the 6 level heder
            after:{
                textDecoration: 'none; letter-spacing: normal; visibility: visible',
                contentText: 'XX' 
            },
            rangeBehavior: vscode.DecorationRangeBehavior.ClosedClosed
             
         })
         const DECO = {
            uglyDecoration: vscode.window.createTextEditorDecorationType({
              letterSpacing: "-0.55em; font-size: 0.1em; visibility: hidden",
              rangeBehavior: vscode.DecorationRangeBehavior.ClosedClosed,
            }),
            revealedUglyDecoration: vscode.window.createTextEditorDecorationType({
              letterSpacing: "normal !important; font-size: inherit !important; visibility: visible !important",
              rangeBehavior: vscode.DecorationRangeBehavior.ClosedClosed,
              after: {
                // letterSpacing: '-0.55em; font-size: 0.1pt; visibility: hidden',
                textDecoration: 'none !important; font-size: 0.1pt !important; visibility: hidden',
              }
            })
            // SEE REVEAL SELECTION FOR EDITS: https://github.com/siegebell/vsc-prettify-symbols-mode/blob/8ead17a83ec24edd2700d23075c0680cc4fa457c/src/PrettyModel.ts#L525
        }
		while (match = regEx.exec(text)) {
			const startPos = activeEditor.document.positionAt(match.index);
            const endPos = activeEditor.document.positionAt(match.index + match[1].length);
            const headerLevel = match[1].length;
           
			const decoration : vscode.DecorationOptions= {
                 range: new vscode.Range(startPos, endPos), 
                 hoverMessage: `Header level ${headerLevel}`
                };
            headers.push(decoration)
		}
		activeEditor.setDecorations(XXX, headers);
		activeEditor.setDecorations(DECO.uglyDecoration, headers);
		////activeEditor.setDecorations(DECO.revealedUglyDecoration, headers);
	}

	function triggerUpdateDecorations() {
		if (timeout) {
			clearTimeout(timeout);
			timeout = undefined;
		}
		timeout = setTimeout(updateDecorations, 500);
	}

	if (activeEditor) {
		triggerUpdateDecorations();
	}

	vscode.window.onDidChangeActiveTextEditor(editor => {
		activeEditor = editor;
		if (editor) {
			triggerUpdateDecorations();
		}
	}, null, context.subscriptions);

	vscode.workspace.onDidChangeTextDocument(event => {
		if (activeEditor && event.document === activeEditor.document) {
			triggerUpdateDecorations();
		}
	}, null, context.subscriptions);


}

export function deactivate() {
}
