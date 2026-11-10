# Case study: a restaurant SaaS

A system with three connected roles: the **customer** (menu on the table's phone), the **waiter/cashier** (panel) and the **kitchen** (panel). A database-less simulator wired the three together on one page through messages between frames.

## Bug types the integrated test found
- **Data lost in a hand-off:** the note a customer typed never reached the waiter's panel.
- **Perceived delay:** the customer saw "order approved" up to 5 s late (periodic polling) although the waiter had approved already.
- **Undo breaking the flow:** the kitchen's "back" button left the guided tour on a step that no longer existed.
- **UI getting in the way:** a help balloon covered fields and buttons; buttons jumped around when another element appeared.
- **Simulator different from the real thing:** in the demo the waiter could not open a table or edit an order, unlike the real system. Lesson: **a simulator is only valid if it uses the same components**.
- **Accessibility:** an icon-only button with no accessible name.
- **Slowness outside the demo:** reordering categories did one write per item and reloaded the whole page on every click; fast repeated clicks piled up in a queue.

## The method that worked
1. Audit the simulator against the real system and make the two identical.
2. Map scenarios and test with every role visible at the same time.
3. Log, fix by root cause and **re-test everything**.
4. Turn each bug into an automated test (Playwright) and the data model into a unit test.

## Numbers
Final suite: 10 multi-role scenarios in ~40 s, against production, with no side effects (the simulator uses no database).
