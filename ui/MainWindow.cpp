#include "MainWindow.h"
#include "SidePanel.h"
#include <QMainWindow>
#include <QVBoxLayout>

MainWindow::MainWindow(QWidget *parent) : QMainWindow(parent) {
    setWindowTitle("Zelgodiz Application");
    setMinimumSize(800, 600);

    // Create the side panel
    SidePanel *sidePanel = new SidePanel(this);

    // Set up the main layout
    QVBoxLayout *layout = new QVBoxLayout();
    layout->addWidget(sidePanel);

    // Create a central widget and set the layout
    QWidget *centralWidget = new QWidget(this);
    centralWidget->setLayout(layout);
    setCentralWidget(centralWidget);
}

MainWindow::~MainWindow() {
    // Destructor implementation (if needed)
}