Then(/^I should be on the Main screen$/) do
    check_element_exists "view:'UILabel' marked:'Main Screen'"
    check_element_exists "view:'UIButton' marked:'Play Connect4'"
    check_element_exists "view:'UIButton' marked:'Sign Up'"
    check_element_exists "view:'UIButton' marked:'Sign In'"
    check_element_exists "view:'_UINavigationBarBackIndicatorView' marked:'Back'"
end

When(/^I click “Play Connect (\d+)”$/) do |arg1|
    touch("view:'UIButton' marked:'Play Connect4'")
end

Then(/^I should be on the Game screen$/) do
    check_element_exists "view:'UILabel' marked:'Main Screen'"
    check_element_exists "view:'UINavigationItemButtonView' marked:'Main Screen'"
    check_element_exists "view:'UILabel' marked:'Connect4'"
    check_element_exists "view:'UINavigationItemView' marked:'Connect4'"
    check_element_exists "view:'_UINavigationBarBackIndicatorView' marked:'Back'"
end
