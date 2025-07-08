#ifndef SIDEPANEL_H
#define SIDEPANEL_H

#include <QWidget>

class SidePanel : public QWidget {
    Q_OBJECT

public:
    SidePanel(QWidget *parent = nullptr);
    void display();
    void interact();

private:
    // Add private members for UI elements and state management
};

#endif // SIDEPANEL_H