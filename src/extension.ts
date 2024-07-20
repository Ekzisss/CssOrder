import * as vscode from 'vscode';
import formatter from './foramtter';

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand('cssOrder.format', () => {
    try {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        throw new Error('No editor');
      }
      const document = editor.document;
      const baseName = document.fileName.slice(document.fileName.lastIndexOf('.'));
      console.log(`file extension is ${baseName}`);

      if (baseName !== '.css') {
        throw new Error('Not .css file');
      }
      const text = document.getText();
      const formattedText = formatter(text);

      editor.edit((editBuilder) => {
        const fullRange = new vscode.Range(document.positionAt(0), document.positionAt(text.length));
        editBuilder.replace(fullRange, formattedText);
      });

      vscode.window.showInformationMessage('Formatted');
    } catch (error) {
      console.error(error);
      vscode.window.showErrorMessage((error as Error).message);
    }
  });

  context.subscriptions.push(disposable);
}

export function deactivate() {}
